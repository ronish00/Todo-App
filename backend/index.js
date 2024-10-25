const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./src/models/todo.model.js");

const app = express();

app.use(express.static("dist"));

// Define an array of allowed origins
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://ronish-personal-todo.vercel.app"
];

// Set up CORS to allow requests from the defined origins
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 204,
}));

app.use(express.json());

const port = 3000;

mongoose
  .connect("mongodb://localhost:27017/todo")
  .then(() => console.log("Connection established"));

app.get("/get", async (req, res) => {
  try {
    const todoItem = await Todo.find();
    res.json(todoItem);
  } catch (err) {
    res.json(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.item;
  try {
    const todoItem = await Todo.create({
      item: item,
    });
    res.json(todoItem);
  } catch (err) {
    res.json(err);
  }
});

app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todoItem = await Todo.deleteOne({ _id: id });
    res.json(todoItem);
  } catch (err) {
    res.json(err);
  }
});

app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const item = req.body.item;

  try {
    const todoItem = await Todo.updateOne(
      { _id: id },
      {
        $set: { item: item },
      }
    );

    res.json(todoItem);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
