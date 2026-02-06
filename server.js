// backend/server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let students = [];
let activeExams = [];
let flags = [];

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Exam monitor API running ✅" });
});

// ---------- STUDENTS ----------
app.post("/api/students", (req, res) => {
  try {
    const { rollNo } = req.body;

    if (!rollNo || !rollNo.trim()) {
      return res.status(400).json({ error: "Roll No required" });
    }

    const roll = rollNo.trim();
    const exists = students.find((s) => s.rollNo === roll);
    if (!exists) {
      students.push({ rollNo: roll });
      console.log("🆕 Student added:", roll);
    } else {
      console.log("ℹ️ Student already exists:", roll);
    }

    res.json({ success: true, students });
  } catch (err) {
    console.error("Error in /api/students:", err);
    res.status(500).json({ error: "Server error while saving student" });
  }
});

app.get("/api/students", (req, res) => {
  res.json(students);
});

// ---------- EXAMS ----------
app.post("/api/start-exam", (req, res) => {
  try {
    const { rollNo, duration } = req.body;

    if (!rollNo || !rollNo.trim()) {
      return res.status(400).json({ error: "Roll No required" });
    }

    const roll = rollNo.trim();
    const dur = Number(duration) || 0;
    const startTime = new Date().toISOString();

    const examData = { rollNo: roll, duration: dur, startTime };
    const idx = activeExams.findIndex((e) => e.rollNo === roll);

    if (idx >= 0) {
      activeExams[idx] = examData;
    } else {
      activeExams.push(examData);
    }

    console.log("⏱️ Exam started:", examData);
    res.json({ success: true, activeExams });
  } catch (err) {
    console.error("Error in /api/start-exam:", err);
    res.status(500).json({ error: "Server error while starting exam" });
  }
});

app.get("/api/active-exams", (req, res) => {
  res.json(activeExams);
});

// ---------- FLAGS ----------
app.post("/api/simulate-cheat", (req, res) => {
  try {
    const { rollNo, site } = req.body;

    if (!rollNo || !rollNo.trim()) {
      return res.status(400).json({ error: "Roll No required" });
    }

    const roll = rollNo.trim();
    const time = new Date().toISOString();
    const flag = { rollNo: roll, site: site || "TAB_EXIT", time };

    flags.push(flag);
    console.log("🚨 Cheat flag:", flag);

    res.json({ success: true, flag });
  } catch (err) {
    console.error("Error in /api/simulate-cheat:", err);
    res.status(500).json({ error: "Server error while logging flag" });
  }
});

app.get("/api/flags", (req, res) => {
  res.json(flags);
});

// ---------- SERVER START ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Students:      http://localhost:${PORT}/api/students`);
  console.log(`📚 Active exams:  http://localhost:${PORT}/api/active-exams`);
  console.log(`📚 Flags:         http://localhost:${PORT}/api/flags`);
});