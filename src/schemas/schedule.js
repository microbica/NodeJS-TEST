const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const data = new Schema(
  {
    mechanic: { type: String, required: true, lowercase: true },
    name: { type: String, required: true, lowercase: true },
    email: { type: String, required: true, lowercase: true },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("schedule", data);
