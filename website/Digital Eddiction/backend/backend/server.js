
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors()); // Development only; restrict origins before deployment
app.use(express.json());

const User = mongoose.model("User", new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  dailyLimitMinutes: { type: Number, default: 60 }
}, { timestamps: true }));

const Course = mongoose.model("Course", new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: String,
  materials: [{ title: String, url: String }],
  quiz: [{
    question: String,
    options: [String],
    correctIndex: Number
  }]
}, { timestamps: true }));

const Contact = mongoose.model("Contact", new mongoose.Schema({
  name: String,
  email: String,
  message: String
}, { timestamps: true }));

const Usage = mongoose.model("Usage", new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dateKey: { type: String, required: true },
  seconds: { type: Number, default: 0 }
}, { timestamps: true }).index(
  { userId: 1, dateKey: 1 }, { unique: true }
));

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

function protect(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return res.status(401).json({ error: "Please log in." });
  }

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

function adminOnly(req, res, next) {
  if (req.auth.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  next();
}

function publicCourse(course) {
  const item = course.toObject ? course.toObject() : course;
  item.quiz = (item.quiz || []).map(q => ({
    question: q.question,
    options: q.options
  }));
  return item;
}

async function todayUsage(userId) {
  // The daily limit resets at UTC midnight in this starter version.
  const dateKey = new Date().toISOString().slice(0, 10);
  let usage = await Usage.findOne({ userId, dateKey });

  if (!usage) {
    usage = await Usage.create({ userId, dateKey, seconds: 0 });
  }

  return usage;
}

// Health check
app.get("/api", (req, res) => {
  res.json({ message: "Digital Eddiction backend is working!" });
});

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() ||
        typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        error: "Enter your name, email, and a password of at least 8 characters."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });

    if (exists) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12)
    });

    res.status(201).json({
      token: signToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Could not register account." });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    const user = await User.findOne({ email });

    if (!user || typeof password !== "string" ||
        !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    res.json({
      token: signToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch {
    res.status(500).json({ error: "Could not log in." });
  }
});

// Get current user
app.get("/api/me", protect, async (req, res) => {
  const user = await User.findById(req.auth.id).select(
    "name email role dailyLimitMinutes"
  );

  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user });
});

// List courses; never send quiz answers to students
app.get("/api/courses", async (req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.json(courses.map(publicCourse));
});

// Admin: create a course, materials, video, and quiz
app.post("/api/courses", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, videoUrl, materials, quiz } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ error: "Course title is required." });
    }

    const course = await Course.create({
      title: title.trim(),
      description,
      videoUrl,
      materials,
      quiz
    });

    res.status(201).json({ course: publicCourse(course) });
  } catch {
    res.status(400).json({ error: "Invalid course data." });
  }
});

// Submit quiz answers
app.post("/api/courses/:id/quiz/submit", protect, async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) return res.status(404).json({ error: "Course not found." });

  const answers = req.body.answers;

  if (!Array.isArray(answers) || answers.length !== course.quiz.length) {
    return res.status(400).json({ error: "Submit an answer for each question." });
  }

  let score = 0;
  course.quiz.forEach((q, i) => {
    if (Number.isInteger(answers[i]) && answers[i] === q.correctIndex) {
      score++;
    }
  });

  res.json({ score, total: course.quiz.length });
});

// Contact form: save a message
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.includes("@") ||
    typeof message !== "string" || !message.trim() ||
    message.length > 5000
  ) {
    return res.status(400).json({ error: "Please enter valid contact details." });
  }

  const contact = await Contact.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim()
  });

  res.status(201).json({ message: "Message saved.", id: contact._id });
});

// Check today's screen time
app.get("/api/time/today", protect, async (req, res) => {
  const user = await User.findById(req.auth.id);
  if (!user) return res.status(404).json({ error: "User not found." });

  const usage = await todayUsage(user._id);
  const limitSeconds = user.dailyLimitMinutes * 60;

  res.json({
    seconds: usage.seconds,
    limitSeconds,
    remainingSeconds: Math.max(0, limitSeconds - usage.seconds),
    locked: usage.seconds >= limitSeconds
  });
});

// Record active screen time in small increments
app.post("/api/time/heartbeat", protect, async (req, res) => {
  const seconds = req.body.seconds;

  // Limit each request to 30 seconds to reduce accidental over-counting.
  if (!Number.isInteger(seconds) || seconds < 1 || seconds > 30) {
    return res.status(400).json({ error: "Invalid time interval." });
  }

  const user = await User.findById(req.auth.id);
  if (!user) return res.status(404).json({ error: "User not found." });

  const usage = await todayUsage(user._id);
  const limitSeconds = user.dailyLimitMinutes * 60;

  if (usage.seconds < limitSeconds) {
    usage.seconds = Math.min(limitSeconds, usage.seconds + seconds);
    await usage.save();
  }

  res.json({
    seconds: usage.seconds,
    limitSeconds,
    remainingSeconds: Math.max(0, limitSeconds - usage.seconds),
    locked: usage.seconds >= limitSeconds
  });
});

// Admin dashboard summary
app.get("/api/admin/summary", protect, adminOnly, async (req, res) => {
  const [users, courses, messages] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Contact.countDocuments()
  ]);

  res.json({ users, courses, messages });
});

// Admin: view contact messages
app.get("/api/admin/contacts", protect, adminOnly, async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 }).limit(200);
  res.json(messages);
});

const PORT = process.env.PORT || 3001;

async function start() {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    throw new Error("Set MONGODB_URI and JWT_SECRET in your .env file.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected.");

  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
}

start().catch(error => {
  console.error("Startup failed:", error.message);
  process.exit(1);
});