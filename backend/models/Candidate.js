const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  skills: [String],
  experience: { type: Number, required: true },
  bio: String,
  resumeUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RealModel = mongoose.model('Candidate', CandidateSchema);

const FILE_PATH = path.join(__dirname, '../data/candidates.json');

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

// Thenable Query for chainable database queries like .sort()
class ThenableQuery {
  constructor(dataPromise) {
    this.dataPromise = dataPromise;
  }

  sort(criteria) {
    const sortedPromise = this.dataPromise.then(data => {
      // For simplicity, sort by date descending
      return [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    });
    return new ThenableQuery(sortedPromise);
  }

  then(onFulfilled, onRejected) {
    return this.dataPromise.then(onFulfilled, onRejected);
  }
}

// Unified transparent class proxy
class Candidate {
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
      // Validate unique email
      if (list.some(c => c.email.toLowerCase() === this.data.email.toLowerCase())) {
        throw new Error('Email address already exists in the system.');
      }
      
      const newCandidate = {
        _id: new mongoose.Types.ObjectId().toString(),
        name: this.data.name,
        email: this.data.email,
        skills: this.data.skills || [],
        experience: Number(this.data.experience) || 0,
        bio: this.data.bio || "",
        resumeUrl: this.data.resumeUrl || "",
        createdAt: new Date().toISOString()
      };
      
      list.push(newCandidate);
      writeData(list);
      return newCandidate;
    }
  }

  // Static chainable read
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
      return list.find(c => c._id === id) || null;
    }
  }

  static async findByIdAndDelete(id) {
    if (mongoose.connection.readyState === 1) {
      return await RealModel.findByIdAndDelete(id);
    } else {
      let list = readData();
      const found = list.find(c => c._id === id);
      if (!found) return null;
      list = list.filter(c => c._id !== id);
      writeData(list);
      return found;
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

  static async insertMany(candidates) {
    if (mongoose.connection.readyState === 1) {
      return await RealModel.insertMany(candidates);
    } else {
      let list = readData();
      const seeded = candidates.map(c => ({
        _id: new mongoose.Types.ObjectId().toString(),
        name: c.name,
        email: c.email,
        skills: c.skills || [],
        experience: Number(c.experience) || 0,
        bio: c.bio || "",
        resumeUrl: c.resumeUrl || "",
        createdAt: new Date().toISOString()
      }));
      list = [...list, ...seeded];
      writeData(list);
      return seeded;
    }
  }
}

module.exports = Candidate;
