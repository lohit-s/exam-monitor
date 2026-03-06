// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let students = [];
let activeExams = [];
let flags = [];

app.get("/exam", (req, res) => {
  res.sendFile(path.join(__dirname, "exam.html"));
});

app.get("/", (req, res) => {
  res.json({ message: "Exam monitor API running ✅" });
});

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
    }
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ error: "Server error while saving student" });
  }
});

app.get("/api/students", (req, res) => {
  res.json(students);
});

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
    res.json({ success: true, activeExams });
  } catch (err) {
    res.status(500).json({ error: "Server error while starting exam" });
  }
});

app.get("/api/active-exams", (req, res) => {
  res.json(activeExams);
});

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
    res.json({ success: true, flag });
  } catch (err) {
    res.status(500).json({ error: "Server error while logging flag" });
  }
});

app.get("/api/flags", (req, res) => {
  res.json(flags);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### STEP 3:
**"Commit changes"** green button click பண்ணு ✅

---

Render auto-deploy ஆனதும்:
```
https://exam-monitor-0dm2.onrender.com/exam
