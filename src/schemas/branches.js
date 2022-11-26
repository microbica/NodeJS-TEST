const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { OPENING, CLOSING } = process.env;

const data = new Schema(
  {
    name: { type: String, unique: true, required: true, lowercase: true },
    opening: { type: String, default: OPENING },
    closing: { type: String, default: CLOSING },
    days: { type: Array, required: true, default: [1, 2, 3, 4, 5] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("branch", data);
