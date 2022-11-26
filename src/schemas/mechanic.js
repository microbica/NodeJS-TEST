const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const data = new Schema(
  {
    name: { type: String, unique: true, required: true, lowercase: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    branchId: { type: ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("mechanic", data);
