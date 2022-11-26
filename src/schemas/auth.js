const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const data = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    status: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("api_auth", data);
