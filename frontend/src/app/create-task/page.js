"use client";
import { useState } from "react";
import { useWeb3 } from "@/context/Web3Context";
import Modal from "@/components/Modal";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function CreateTaskPage() {
  const { web3State } = useWeb3();
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, content: "", type: "info" });

  const createTask = async (e) => {
    e.preventDefault();
    const { contract, account } = web3State;

    if (!contract || !account) {
      setModal({ open: true, content: "Wallet connect koro first!", type: "error" });
      return;
    }

    if (!taskName || !taskDate) {
      setModal({ open: true, content: "Task name and date dite hobe!", type: "error" });
      return;
    }

    setLoading(true);
    try {
      // Step 1: Backend e date clash check
      const res = await fetch(`${BACKEND}/api/ethereum/create-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskDate }),
      });
      const data = await res.json();

      if (data.status !== 200) {
        setModal({ open: true, content: "এই date এ আগে task আছে! অন্য date নাও।", type: "error" });
        return;
      }

      // Step 2: Blockchain e task create
      const tx = await contract.methods
        .createTask(taskName, taskDate)
        .send({ from: account });

      // Step 3: MongoDB te log save (MERN part)
      const allTasks = await contract.methods.allTask().call();
      const newTaskId = allTasks.length;

      await fetch(`${BACKEND}/api/ethereum/create-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskDate,
          taskName,
          walletAddress: account,
          txHash: tx.transactionHash,
          taskId: newTaskId,
        }),
      });

      setModal({
        open: true,
        content: `✅ Task "${taskName}" successfully created on blockchain!`,
        type: "success",
      });
      setTaskName("");
      setTaskDate("");
    } catch (error) {
      console.error(error);
      setModal({ open: true, content: "Task create hoyni. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page_title">
        Create <span>Task</span>
      </h1>

      <div className="todo_btn">
        <form onSubmit={createTask}>
          <label>
            Task Name:
            <input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g. Complete assignment"
              required
            />
          </label>
          <label>
            Task Date:
            <input
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "⛓️ Create on Blockchain"}
          </button>
        </form>
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        content={modal.content}
        type={modal.type}
      />
    </div>
  );
}
