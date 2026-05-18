const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Employee = require('../models/Employee');

dotenv.config();

const sampleUsers = [
  {
    name: "Abhishek Guruji",
    email: "hr@guruji.ai",
    password: "Password123",
    role: "hr"
  },
  {
    name: "Rahul Sharma",
    email: "rahul@guruji.ai",
    password: "Password123",
    role: "employee"
  },
  {
    name: "Priya Patel",
    email: "priya@guruji.ai",
    password: "Password123",
    role: "employee"
  },
  {
    name: "Amit Verma",
    email: "amit@guruji.ai",
    password: "Password123",
    role: "employee"
  },
  {
    name: "Rohan Das",
    email: "rohan@guruji.ai",
    password: "Password123",
    role: "employee"
  },
  {
    name: "Sneha Reddy",
    email: "sneha@guruji.ai",
    password: "Password123",
    role: "employee"
  }
];

const sampleEmployees = [
  {
    employeeId: "EMP-2041",
    name: "Rahul Sharma",
    email: "rahul@guruji.ai",
    department: "Engineering",
    skills: ["React", "Node.js", "ExpressJS", "MongoDB", "AWS", "JavaScript"],
    performanceScore: 92,
    experience: 5,
    projects: [
      { name: "Global Cloud Migrator", score: 95, role: "Lead Engineer" },
      { name: "Analytics Processor", score: 88, role: "Backend Contributor" }
    ],
    aiFeedback: "Rahul consistently demonstrates strong technical leadership in our full stack stack. He successfully migrated legacy infrastructure to AWS with zero downtime, improving API response times by 35%. Excellent communicator, though should focus slightly more on delegating tasks to junior engineers to build leadership capacity.",
    trainingSuggestions: "1. Advanced System Design & Architecture Course\n2. AWS Certified Solutions Architect Professional\n3. Leadership Communications masterclass",
    ranking: 2
  },
  {
    employeeId: "EMP-2042",
    name: "Priya Patel",
    email: "priya@guruji.ai",
    department: "Design",
    skills: ["Tailwind CSS", "JavaScript", "HTML", "CSS", "Figma", "UI/UX Prototyping"],
    performanceScore: 84,
    experience: 2,
    projects: [
      { name: "Glassmorphism UI Framework", score: 90, role: "Designer" },
      { name: "Corporate Mobile Mockups", score: 78, role: "Visual Planner" }
    ],
    aiFeedback: "Priya has a highly creative mindset and an outstanding eye for modern design trends, as evidenced by our premium dashboard glassmorphism revamp. She works efficiently with engineering teams. Highly cooperative. For growth, she should work on expanding her JS coding capabilities and frontend state frameworks.",
    trainingSuggestions: "1. Deep Dive: CSS Grid and Modern CSS layouts\n2. React for Designers - Skillshare\n3. Figma Advanced Component Libraries & Design Systems",
    ranking: 4
  },
  {
    employeeId: "EMP-2043",
    name: "Amit Verma",
    email: "amit@guruji.ai",
    department: "Engineering",
    skills: ["Node.js", "Python", "MongoDB", "Redis", "Docker", "REST APIs", "SQL"],
    performanceScore: 96,
    experience: 6,
    projects: [
      { name: "High-Throughput WebSockets", score: 98, role: "Architect" },
      { name: "Data Aggregation Hub", score: 94, role: "Lead Developer" }
    ],
    aiFeedback: "Amit is an outstanding engineer who commands core backend processes flawlessly. He designed and deployed our live analytics event aggregator, scaling effortlessly to 50k events per minute. Extremely precise and detail-oriented. Ready for transition to Technical Lead or System Architect role.",
    trainingSuggestions: "1. Kubernetes & Distributed Orchestration Deep-Dive\n2. AI Model Integration & Vector Database optimization\n3. Agile Engineering Management Certificate",
    ranking: 1
  },
  {
    employeeId: "EMP-2044",
    name: "Rohan Das",
    email: "rohan@guruji.ai",
    department: "Product",
    skills: ["React", "Express", "Node.js", "MongoDB", "Agile Management", "Jira"],
    performanceScore: 68,
    experience: 1,
    projects: [
      { name: "Client Feedback Portal", score: 70, role: "Junior Developer" }
    ],
    aiFeedback: "Rohan is highly motivated and quick to implement feedback. As a junior developer transitioning to product operations, he did a great job coordinating with client feedback pipelines. He should focus on establishing stronger coding standards, testing patterns, and mastering async architectures.",
    trainingSuggestions: "1. MERN Stack Complete Bootcamp (Udemy)\n2. JavaScript Algorithms & Data Structures (freeCodeCamp)\n3. Product Management Foundations",
    ranking: 5
  },
  {
    employeeId: "EMP-2045",
    name: "Sneha Reddy",
    email: "sneha@guruji.ai",
    department: "Mobile",
    skills: ["React Native", "Swift", "Firebase", "TypeScript", "App Deployment"],
    performanceScore: 88,
    experience: 4,
    projects: [
      { name: "Android App Launch", score: 91, role: "Developer" },
      { name: "iOS Swift Analytics Tracker", score: 85, role: "Lead Native Dev" }
    ],
    aiFeedback: "Sneha has been critical in scaling our native mobile offerings. She single-handedly refactored the Android application rendering engine, reducing user crash rates by 60%. Very methodical. Suggested to take ownership of cross-department mobile alignment in the next phase.",
    trainingSuggestions: "1. Advanced React Native Performance Tuning\n2. Swift & SwiftUI Advanced Concepts\n3. Mobile DevOps: CI/CD for App Store & Google Play",
    ranking: 3
  }
];

const seedDB = async () => {
  let isMongo = false;
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employee-analytics';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log("✅ Connected to MongoDB for seeding...");
    isMongo = true;
  } catch (error) {
    console.log("⚠️ Local MongoDB connection failed (ECONNREFUSED).");
    console.log("📂 Seeding fallback local JSON files instead...");
  }

  try {
    // 1. Clear database/json
    await User.deleteMany({});
    await Employee.deleteMany({});
    console.log("Cleared existing Users & Employees database.");

    // 2. Insert new sample sets
    const seededUsers = await User.insertMany(sampleUsers);
    console.log(`Successfully seeded ${seededUsers.length} user accounts with hashed passwords.`);

    const seededEmployees = await Employee.insertMany(sampleEmployees);
    console.log(`Successfully seeded ${seededEmployees.length} employee performance profiles.`);

    console.log("\n==============================================");
    console.log("🎉 SEEDING COMPLETE! DEMO LOGINS:");
    console.log("🔑 HR Account: email: hr@guruji.ai | password: Password123");
    console.log("🔑 Employee Account: email: rahul@guruji.ai | password: Password123");
    console.log("==============================================\n");

    if (isMongo) {
      await mongoose.connection.close();
      console.log("Database connection closed safely.");
    }
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
