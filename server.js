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
    if (!exists) students.push({ rollNo: roll });
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/students", (req, res) => res.json(students));

app.post("/api/start-exam", (req, res) => {
  try {
    const { rollNo, duration } = req.body;
    if (!rollNo || !rollNo.trim()) {
      return res.status(400).json({ error: "Roll No required" });
    }
    const roll = rollNo.trim();
    const examData = { rollNo: roll, duration: Number(duration) || 0, startTime: new Date().toISOString() };
    const idx = activeExams.findIndex((e) => e.rollNo === roll);
    if (idx >= 0) activeExams[idx] = examData;
    else activeExams.push(examData);
    res.json({ success: true, activeExams });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/active-exams", (req, res) => res.json(activeExams));

app.post("/api/simulate-cheat", (req, res) => {
  try {
    const { rollNo, site } = req.body;
    if (!rollNo || !rollNo.trim()) {
      return res.status(400).json({ error: "Roll No required" });
    }
    const flag = { rollNo: rollNo.trim(), site: site || "TAB_EXIT", time: new Date().toISOString() };
    flags.push(flag);
    res.json({ success: true, flag });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/flags", (req, res) => res.json(flags));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
