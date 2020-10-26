const express = require("express");
const Task = require("../models/task");
const router = express.Router();
const User = require("../models/user");

router.post("/create", (req, res, next) => {
  const task = new Task({
    title: req.body.title,
    deadline: req.body.deadline,
    employeeIds: req.body.emps,
    employeeProgress: req.body.empProgress,
    manager: req.body.manager
  });
  task.save().then(result => {
    User.findByIdAndUpdate(
      req.body.manager,
      {
        $push: { tasks: result._id }
      },
      { useFindAndModify: false }
    ).then(result2 => {
      let emps = req.body.emps;
      for (let i = 0; i < emps.length; i++) {
        User.findByIdAndUpdate(
          emps[i],
          { $push: { tasks: result._id } },
          { useFindAndModify: false }
        ).then(a => console.log(a));
      }
      res.status(201).json({ task: result });
    });
  });
});

router.put("/edit", (req, res, next) => {
  console.log("over here");
  let task = {
    _id: req.body.taskid,
    title: req.body.title,
    deadline: req.body.deadline,
    employeeIds: req.body.emps,
    employeeProgress: req.body.empProgress,
    manager: req.body.manager
  };
  console.log(task);
  Task.updateOne({ _id: task._id }, task).then(() => {
    console.log("updated");
    res.status(201).json({ msg: "updated" });
  });
});

router.post("/progress", (req, res, next) => {
  Task.updateOne(
    { _id: req.body.taskid, "employeeProgress._id": req.body.eid },
    {
      $set: {
        "employeeProgress.$.note": req.body.note,
        "employeeProgress.$.progress": req.body.progress
      }
    }
  ).then(r => {
    console.log(r);
    console.log("updated");
    res.status(201).json({ msg: "updated" });
  });
});

router.get("/:id", (req, res, next) => {
  User.findById({ _id: req.params.id }).then(user => {
    let tasks = user.tasks;
    console.log(tasks);
    let resTasks = [];
    for (let i = 0; i < tasks.length; i++) {
      Task.findById({ _id: tasks[i] }).then(result => {
        resTasks.push(result);
        if (resTasks.length === tasks.length) {
          console.log("res sent ");
          res.status(201).json({ tasks: resTasks });
        }
      });
    }
  });
});

module.exports = router;
