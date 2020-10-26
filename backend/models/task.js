const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String },
  deadline: { type: Date },
  manager: mongoose.Schema.Types.ObjectId,
  employeeIds: [mongoose.Schema.Types.ObjectId],
  employeeProgress: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId },
      note: { type: String, default: "" },
      progress: { type: Number, default: 0 }
    }
  ]
});

module.exports = mongoose.model("Task", taskSchema);
