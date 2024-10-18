const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/todo.model.js");

const app = express();

app.use(express.static("dist"));

app.use(cors({
    origin: "http://localhost:5174",
    optionsSuccessStatus: 204
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
  const {id} = req.params;
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
