"use client";
import { useState } from "react";
import { useWeb3 } from "@/context/Web3Context";
import Modal from "@/components/Modal";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function DeleteTaskPage() {
  const { web3State } = useWeb3();
  const [taskId, setTaskId] = useState("");
  const [taskInfo, setTaskInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, content: "", type: "info" });

  // First view the task before deleting
  const fetchTask = async (e) => {
    e.preventDefault();
    if (!taskId) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/ethereum/view-task/${taskId}`);
      const data = await res.json();
      if (data.status === 200) {
        setTaskInfo(data.taskObj);
      } else {
        setModal({ open: true, content: "Task found hoyni!", type: "error" });
      }
    } catch (err) {
      setModal({ open: true, content: "Error. Task exist kore na.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    const { contract, account } = web3State;

    if (!contract || !account) {
      setModal({ open: true, content: "Wallet connect koro first!", type: "error" });
      return;
    }

    setLoading(true);
    try {
      // Backend e priority check
      const res = await fetch(`${BACKEND}/api/ethereum/delete-task/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: account,
          taskName: taskInfo?.name,
          taskDate: taskInfo?.date,
        }),
      });
      const data = await res.json();

      if (data.status === 403) {
        setModal({ open: true, content: "Priority task delete kora jabe na!", type: "error" });
        return;
      }

      // Blockchain e delete
      const tx = await contract.methods
        .deleteTask(taskId)
        .send({ from: account });

      // MongoDB te delete log with txHash
      await fetch(`${BACKEND}/api/ethereum/delete-task/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: account,
          taskName: taskInfo?.name,
          taskDate: taskInfo?.date,
          txHash: tx.transactionHash,
        }),
      });

      setModal({
        open: true,
        content: `Task #${taskId} delete hoye geche blockchain theke!`,
        type: "success",
      });
      setTaskId("");
      setTaskInfo(null);
    } catch (error) {
      console.error(error);
      setModal({ open: true, content: "Task delete hoyni. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page_title">
        Delete <span>Task</span>
      </h1>

      {taskInfo && (
        <div className="single_task_card">
          <h3>Task to Delete</h3>
          <p>ID: <span>#{taskInfo.numId}</span></p>
          <p>Name: <span>{taskInfo.name}</span></p>
          <p>Date: <span>{taskInfo.date}</span></p>
          <div style={{ marginTop: "16px" }}>
            <button className="danger" onClick={deleteTask} disabled={loading}>
              {loading ? "Deleting..." : "🗑️ Confirm Delete"}
            </button>
          </div>
        </div>
      )}

      <div className="todo_btn">
        <form onSubmit={fetchTask}>
          <label>
            Task ID:
            <input
              type="number"
              value={taskId}
              onChange={(e) => { setTaskId(e.target.value); setTaskInfo(null); }}
              placeholder="e.g. 1"
              min="1"
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "🔍 Find Task"}
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
