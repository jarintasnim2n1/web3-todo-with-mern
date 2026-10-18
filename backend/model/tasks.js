const { contract } = require("../contract/contract");

// Date clash check - blockchain theke check kore
const dateclashCheck = async (taskDate) => {
  const tasks = await contract.methods.allTask().call();
  const foundTask = tasks.find((task) => task.date === taskDate);
  if (foundTask) {
    return foundTask.name;
  }
  return "No Task Found";
};

// Priority check - task name e "priority" ache kina
const priorityCheck = async (id) => {
  const tasks = await contract.methods.allTask().call();
  const taskIndex = id - 1;
  if (taskIndex < 0 || taskIndex >= tasks.length) {
    throw new Error("Task not found");
  }
  const result = tasks[taskIndex].name.toLowerCase().includes("priority");
  return result;
};

module.exports = { dateclashCheck, priorityCheck };
