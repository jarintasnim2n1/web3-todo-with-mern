const { dateclashCheck, priorityCheck } = require("../model/tasks");
const { contract } = require("../contract/contract");
const TaskLog = require("../model/TaskLog");

// POST /api/ethereum/create-task
const createTask = async (req, res) => {
  const { taskDate, taskName, walletAddress, txHash, taskId } = req.body;
  try {
    const clashResult = await dateclashCheck(taskDate);
    if (clashResult !== "No Task Found") {
      return res
        .status(409)
        .json({ status: 409, message: "Date clash: Task cannot be added" });
    }

    // MongoDB te log save koro (MERN part)
    if (taskName && walletAddress && taskId) {
      await TaskLog.create({
        taskId,
        taskName,
        taskDate,
        action: "created",
        walletAddress,
        txHash: txHash || null,
      });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Task can be added" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

// POST /api/ethereum/update-task
const updateTask = async (req, res) => {
  const { taskDate, taskName, walletAddress, txHash, taskId } = req.body;
  try {
    const clashResult = await dateclashCheck(taskDate);
    if (clashResult !== "No Task Found") {
      return res
        .status(409)
        .json({ status: 409, message: "Date clash: Task cannot be updated" });
    }

    // MongoDB te update log
    if (taskName && walletAddress && taskId) {
      await TaskLog.create({
        taskId,
        taskName,
        taskDate,
        action: "updated",
        walletAddress,
        txHash: txHash || null,
      });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Task can be updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

// DELETE /api/ethereum/delete-task/:taskId
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { walletAddress, txHash, taskName, taskDate } = req.body;

    const isProtected = await priorityCheck(taskId);
    if (isProtected) {
      return res
        .status(403)
        .json({ status: 403, message: "Priority task cannot be deleted" });
    }

    // MongoDB te delete log
    if (walletAddress) {
      await TaskLog.create({
        taskId: Number(taskId),
        taskName: taskName || "Unknown",
        taskDate: taskDate || "Unknown",
        action: "deleted",
        walletAddress,
        txHash: txHash || null,
      });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Task can be deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

// GET /api/ethereum/view-task/:taskId
const viewTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await contract.methods.viewTask(taskId).call();
    const { id, name, date } = task;
    const numId = Number(id);
    const taskObj = { numId, name, date };
    return res
      .status(200)
      .json({ status: 200, taskObj, message: "Task found" });
  } catch (error) {
    console.error(error);
    return res
      .status(404)
      .json({ status: 404, message: "Task does not exist" });
  }
};

// GET /api/ethereum/view-all-task
const allTasks = async (req, res) => {
  try {
    const tasks = await contract.methods.allTask().call();
    const taskList = tasks
      .filter((t) => t.name !== "")
      .map(({ id, name, date }) => {
        const taskId = Number(id);
        return { taskId, name, date };
      });
    return res
      .status(200)
      .json({ status: 200, taskList, message: "Tasks found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

// GET /api/ethereum/task-logs - MongoDB theke history
const taskLogs = async (req, res) => {
  try {
    const logs = await TaskLog.find().sort({ createdAt: -1 });
    return res.status(200).json({ status: 200, logs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

module.exports = { createTask, updateTask, deleteTask, viewTask, allTasks, taskLogs };
