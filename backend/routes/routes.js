const express = require("express");
const router = express.Router();
const {
  createTask,
  updateTask,
  deleteTask,
  viewTask,
  allTasks,
  taskLogs,
} = require("../controllers/controllers");

router.post("/create-task", createTask);
router.post("/update-task", updateTask);
router.delete("/delete-task/:taskId", deleteTask);
router.get("/view-task/:taskId", viewTask);
router.get("/view-all-task", allTasks);
router.get("/task-logs", taskLogs); // MongoDB history

module.exports = router;
