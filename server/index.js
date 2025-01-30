import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 5000;
const JWT_SECRET = "your-secret-key"; // In production, use environment variable

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// Todo Schema with user reference
const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  description: String,
  priority: { type: String, enum: ["high", "medium", "low"] },
  deadline: Date,
  notes: String,
  attachments: [
    {
      filename: String,
      contentType: String,
      data: Buffer,
    },
  ],
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Todo = mongoose.model("Todo", todoSchema);

const priorityOrder = {
  high: 1,
  medium: 2,
  low: 3,
};

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error();
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};

// Auth routes
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Todo routes
app.post("/api/todos", auth, upload.array("attachments"), async (req, res) => {
  try {
    const files = req.files
      ? req.files.map((file) => ({
          filename: file.originalname,
          contentType: file.mimetype,
          data: file.buffer,
        }))
      : [];

    const todo = new Todo({
      ...req.body,
      userId: req.user.id,
      attachments: files,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/todos", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id }).sort({
      priority: 1,
      createdAt: -1,
    });

    const sortedTodos = todos.sort((a, b) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    res.json(sortedTodos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/todos/date/:date", auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const todos = await Todo.find({
      userId: req.user.id,
      deadline: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ priority: 1, createdAt: -1 });

    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/todos/upcoming", auth, async (req, res) => {
  try {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const todos = await Todo.find({
      userId: req.user.id,
      deadline: {
        $gte: now,
        $lte: in24Hours,
      },
    }).sort({ deadline: 1 });

    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/todos/files/:todoId/:fileIndex", auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.todoId,
      userId: req.user.id,
    });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const file = todo.attachments[req.params.fileIndex];
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.set("Content-Type", file.contentType);
    res.set("Content-Disposition", `attachment; filename="${file.filename}"`);
    res.send(file.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/todos/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
