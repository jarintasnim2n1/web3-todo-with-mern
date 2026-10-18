"use client";
import { useState, useEffect } from "react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function ViewAllTasksPage() {
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/ethereum/view-all-task`);
        const data = await res.json();
        if (data.status === 200) {
          setTaskList(data.taskList);
        } else {
          setError("Tasks load hoyni");
        }
      } catch (err) {
        setError("Server error. Backend চালু আছে কিনা check কর।");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <h1 className="page_title">
        All <span>Tasks</span>
      </h1>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <span>Blockchain theke data loading...</span>
        </div>
      )}

      {error && <div className="alert error">{error}</div>}

      {!loading && !error && taskList.length === 0 && (
        <div className="empty_state">
          <p>🗂️ Kono task nai. Create Task e giye task add koro!</p>
        </div>
      )}

      <div className="view_all_tasks">
        {taskList.map((task) => (
          <div className="view_all_tasks_card" key={task.taskId}>
            <p>Task #{task.taskId}</p>
            <p>{task.name}</p>
            <p>📅 {task.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
