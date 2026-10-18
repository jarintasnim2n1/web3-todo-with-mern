"use client";
import { useState, useEffect } from "react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function TaskLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/ethereum/task-logs`);
        const data = await res.json();
        if (data.status === 200) {
          setLogs(data.logs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const formatDate = (iso) => new Date(iso).toLocaleString("bn-BD");

  return (
    <div>
      <h1 className="page_title">
        Task <span>History</span>
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "24px", fontSize: "0.9rem" }}>
        MongoDB te stored সব blockchain transaction log
      </p>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <span>Loading history...</span>
        </div>
      )}

      {!loading && logs.length === 0 && (
        <div className="empty_state">
          <p>📋 Kono history nai. Task create/update/delete koro first.</p>
        </div>
      )}

      {logs.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table className="logs_table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Task</th>
                <th>Date</th>
                <th>Wallet</th>
                <th>TX Hash</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>
                    <span className={`badge ${log.action}`}>{log.action}</span>
                  </td>
                  <td>{log.taskName}</td>
                  <td>{log.taskDate}</td>
                  <td style={{ fontFamily: "monospace" }}>
                    {log.walletAddress.slice(0, 6)}...{log.walletAddress.slice(-4)}
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                    {log.txHash
                      ? `${log.txHash.slice(0, 8)}...`
                      : "—"}
                  </td>
                  <td>{formatDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
