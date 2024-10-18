const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);