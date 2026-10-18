"use client";
import { useState } from "react";
import Modal from "@/components/Modal";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function ViewTaskPage() {
  const [taskId, setTaskId] = useState("");
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, content: "", type: "info" });

  const viewTask = async (e) => {
    e.preventDefault();
    if (!taskId) return;

    setLoading(true);
    setTask(null);
    try {
      const res = await fetch(`${BACKEND}/api/ethereum/view-task/${taskId}`);
      const data = await res.json();
      if (data.status === 200) {
        setTask(data.taskObj);
      } else {
        setModal({ open: true, content: "Task found hoyni!", type: "error" });
      }
    } catch (error) {
      setModal({ open: true, content: "Task exist kore na or server error.", type: "error" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page_title">
        View <span>Task</span>
      </h1>

      {task && (
        <div className="single_task_card">
          <h3>Task Found on Blockchain</h3>
          <p>ID: <span>#{task.numId}</span></p>
          <p>Name: <span>{task.name}</span></p>
          <p>Date: <span>{task.date}</span></p>
        </div>
      )}

      <div className="todo_btn">
        <form onSubmit={viewTask}>
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
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "🔍 View Task"}
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
