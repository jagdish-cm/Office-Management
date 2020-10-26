const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  post: { type: String },
  tasks: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model("User", userSchema);
