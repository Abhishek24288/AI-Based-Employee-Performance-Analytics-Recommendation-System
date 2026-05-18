const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['hr', 'employee'], default: 'employee' },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving to MongoDB
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const RealModel = mongoose.model('User', UserSchema);

const FILE_PATH = path.join(__dirname, '../data/users.json');

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

class User {
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
      if (list.some(u => u.email.toLowerCase() === this.data.email.toLowerCase())) {
        throw new Error('Email address already exists in the system.');
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.data.password, salt);

      const newUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        name: this.data.name,
        email: this.data.email.toLowerCase(),
        password: hashedPassword,
        role: this.data.role || 'employee',
        createdAt: new Date().toISOString()
      };

      list.push(newUser);
      writeData(list);
      return newUser;
    }
  }

  static async find() {
    if (mongoose.connection.readyState === 1) {
      return RealModel.find();
    } else {
      return readData();
    }
  }

  static async findOne({ email }) {
    if (mongoose.connection.readyState === 1) {
      return await RealModel.findOne({ email: email.toLowerCase() });
    } else {
      const list = readData();
      return list.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }
  }

  static async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return await RealModel.findById(id);
    } else {
      const list = readData();
      return list.find(u => u._id === id) || null;
    }
  }

  static async comparePassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }

  static async deleteMany() {
    if (mongoose.connection.readyState === 1) {
      return await RealModel.deleteMany({});
    } else {
      writeData([]);
      return { deletedCount: 0 };
    }
  }

  static async insertMany(users) {
    if (mongoose.connection.readyState === 1) {
      const hashedUsers = await Promise.all(users.map(async u => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        return {
          name: u.name,
          email: u.email.toLowerCase(),
          password: hashedPassword,
          role: u.role || 'employee',
          createdAt: u.createdAt || new Date()
        };
      }));
      return await RealModel.insertMany(hashedUsers);
    } else {
      let list = readData();
      const seeded = await Promise.all(users.map(async u => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        return {
          _id: new mongoose.Types.ObjectId().toString(),
          name: u.name,
          email: u.email.toLowerCase(),
          password: hashedPassword,
          role: u.role || 'employee',
          createdAt: new Date().toISOString()
        };
      }));
      list = [...list, ...seeded];
      writeData(list);
      return seeded;
    }
  }
}

module.exports = User;
