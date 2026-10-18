"use client";
import { useState } from "react";
import { useWeb3 } from "@/context/Web3Context";
import Modal from "@/components/Modal";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function UpdateTaskPage() {
  const { web3State } = useWeb3();
  const [taskId, setTaskId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, content: "", type: "info" });

  const updateTask = async (e) => {
    e.preventDefault();
    const { contract, account } = web3State;

    if (!contract || !account) {
      setModal({ open: true, content: "Wallet connect koro first!", type: "error" });
      return;
    }

    setLoading(true);
    try {
      // Backend e date clash check
      const res = await fetch(`${BACKEND}/api/ethereum/update-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskDate }),
      });
      const data = await res.json();

      if (data.status !== 200) {
        setModal({ open: true, content: "Date clash! Ei date e onno task ache.", type: "error" });
        return;
      }

      // Blockchain e update
      const tx = await contract.methods
        .updateTask(taskId, taskName, taskDate)
        .send({ from: account });

      // MongoDB te log
      await fetch(`${BACKEND}/api/ethereum/update-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskDate,
          taskName,
          walletAddress: account,
          txHash: tx.transactionHash,
          taskId: Number(taskId),
        }),
      });

      setModal({
        open: true,
        content: `Task #${taskId} update hoye geche! Name: "${taskName}", Date: ${taskDate}`,
        type: "success",
      });
      setTaskId("");
      setTaskName("");
      setTaskDate("");
    } catch (error) {
      console.error(error);
      setModal({ open: true, content: "Task update hoyni. ID check koro.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page_title">
        Update <span>Task</span>
      </h1>

      <div className="todo_btn">
        <form onSubmit={updateTask}>
          <label>
            Task ID:
            <input
              type="number"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              placeholder="e.g. 1"
              min="1"
              required
            />
          </label>
          <label>
            New Task Name:
            <input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g. Updated task name"
              required
            />
          </label>
          <label>
            New Date:
            <input
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "✏️ Update on Blockchain"}
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
