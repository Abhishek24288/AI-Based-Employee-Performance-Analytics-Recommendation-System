const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  skills: [String],
  performanceScore: { type: Number, default: 0 },
  experience: { type: Number, default: 0 },
  projects: { type: Array, default: [] }, // Array of { name, description, score } or plain strings
  aiFeedback: { type: String, default: '' },
  trainingSuggestions: { type: String, default: '' },
  ranking: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const RealModel = mongoose.model('Employee', EmployeeSchema);

const FILE_PATH = path.join(__dirname, '../data/employees.json');

// Ensure directory and JSON file exist for fallback
if (!fs.existsSync(path.dirname(FILE_PATH))) {
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
}
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2));
}

const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
  } catch (e) {
    return [];
  }
};

const writeData = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

// Chainable ThenableQuery helper for JSON fallback
class ThenableQuery {
  constructor(dataPromise) {
    this.dataPromise = dataPromise;
  }

  sort(criteria) {
    const sortedPromise = this.dataPromise.then(data => {
      // Sort by performance score descending if rating or performanceScore is sort criteria
      if (criteria && (criteria.performanceScore !== undefined || criteria.ranking !== undefined)) {
        return [...data].sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0));
      }
      return [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    });
    return new ThenableQuery(sortedPromise);
  }

  then(onFulfilled, onRejected) {
    return this.dataPromise.then(onFulfilled, onRejected);
  }
}

class Employee {
  constructor(data) {
    this.data = data;
    if (mongoose.connection.readyState === 1) {
      this.instance = new RealModel(data);
    } else {
      this.instance = null;
    }
  }

  async save() {
    if (mongoose.connection.readyState === 1 && this.instance) {
      return await this.instance.save();
    } else {
      const list = readData();
      
      // If we are updating an existing one through save()
      const existingIdx = list.findIndex(e => e.employeeId === this.data.employeeId || e.email.toLowerCase() === this.data.email.toLowerCase());
      
      const empData = {
        _id: this.data._id || new mongoose.Types.ObjectId().toString(),
        employeeId: this.data.employeeId,
        name: this.data.name,
        email: this.data.email.toLowerCase(),
        department: this.data.department,
        skills: this.data.skills || [],
        performanceScore: Number(this.data.performanceScore) || 0,
        experience: Number(this.data.experience) || 0,
        projects: this.data.projects || [],
        aiFeedback: this.data.aiFeedback || '',
        trainingSuggestions: this.data.trainingSuggestions || '',
        ranking: Number(this.data.ranking) || 0,
        createdAt: this.data.createdAt || new Date().toISOString()
      };

      if (existingIdx !== -1) {
        list[existingIdx] = { ...list[existingIdx], ...empData };
      } else {
        list.push(empData);
      }
      
      writeData(list);
      return empData;
    }
  }

  static find() {
    if (mongoose.connection.readyState === 1) {
      return RealModel.find();
    } else {
      return new ThenableQuery(Promise.resolve(readData()));
    }
  }

  static async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return await RealModel.findById(id);
    } else {
      const list = readData();
      return list.find(e => e._id === id || e.employeeId === id) || null;
    }
  }

  static async findOne({ email }) {
    if (mongoose.connection.readyState === 1) {
      return await RealModel.findOne({ email: email.toLowerCase() });
    } else {
      const list = readData();
      return list.find(e => e.email.toLowerCase() === email.toLowerCase()) || null;
    }
  }

  static async findByIdAndDelete(id) {
    if (mongoose.connection.readyState === 1) {
      return await RealModel.findByIdAndDelete(id);
    } else {
      let list = readData();
      const found = list.find(e => e._id === id || e.employeeId === id);
      if (!found) return null;
      list = list.filter(e => e._id !== id && e.employeeId !== id);
      writeData(list);
      return found;
    }
  }

  static async findByIdAndUpdate(id, updateData, options = {}) {
    if (mongoose.connection.readyState === 1) {
      return await RealModel.findByIdAndUpdate(id, updateData, { new: true, ...options });
    } else {
      const list = readData();
      const idx = list.findIndex(e => e._id === id || e.employeeId === id);
      if (idx === -1) return null;
      
      // Update fields
      const updated = {
        ...list[idx],
        ...updateData,
        // Ensure values are properly casted
        skills: updateData.skills !== undefined ? updateData.skills : list[idx].skills,
        projects: updateData.projects !== undefined ? updateData.projects : list[idx].projects,
        performanceScore: updateData.performanceScore !== undefined ? Number(updateData.performanceScore) : list[idx].performanceScore,
        experience: updateData.experience !== undefined ? Number(updateData.experience) : list[idx].experience,
        ranking: updateData.ranking !== undefined ? Number(updateData.ranking) : list[idx].ranking,
      };

      list[idx] = updated;
      writeData(list);
      return updated;
    }
  }

  static async deleteMany() {
    if (mongoose.connection.readyState === 1) {
      return await RealModel.deleteMany({});
    } else {
      writeData([]);
      return { deletedCount: 0 };
    }
  }

  static async insertMany(employees) {
    if (mongoose.connection.readyState === 1) {
      return await RealModel.insertMany(employees);
    } else {
      let list = readData();
      const seeded = employees.map(e => ({
        _id: new mongoose.Types.ObjectId().toString(),
        employeeId: e.employeeId,
        name: e.name,
        email: e.email.toLowerCase(),
        department: e.department,
        skills: e.skills || [],
        performanceScore: Number(e.performanceScore) || 0,
        experience: Number(e.experience) || 0,
        projects: e.projects || [],
        aiFeedback: e.aiFeedback || '',
        trainingSuggestions: e.trainingSuggestions || '',
        ranking: Number(e.ranking) || 0,
        createdAt: new Date().toISOString()
      }));
      list = [...list, ...seeded];
      writeData(list);
      return seeded;
    }
  }
}

module.exports = Employee;
