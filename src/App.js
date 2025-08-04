import React, { useState, useEffect } from "react";
import "./styles.css";

export default function App() {
  const defaultTasks = [
    { text: "临商银行：申请折扣", due: "2025-08-08", status: "未开始" },
    { text: "FFT Investment：税务审批", due: "2025-08-08", status: "商务审批中" },
    { text: "Siemens Energy：沟通汇率问题", due: "2025-08-08", status: "进行中" },
    { text: "CC：沟通 overusage", due: "2025-08-15", status: "进行中" }
  ];

  const defaultCancel = [
    { client: "中南政法大学", end: "2025-12-31", status: "月底前完成取消流程" },
    { client: "粤铁投", end: "2025-12-31", status: "等待后续操作" },
    { client: "8Mile", end: "", status: "待客户反馈，年底确认是否取消" }
  ];

  const [page, setPage] = useState("tasks");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : defaultTasks;
  });
  const [cancels] = useState(() => {
    const saved = localStorage.getItem("cancels");
    return saved ? JSON.parse(saved) : defaultCancel;
  });
  const [hideCompleted, setHideCompleted] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newDue, setNewDue] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const today = new Date().toISOString().split("T")[0];

  const addTask = () => {
    if (!newTask.trim()) return;
    const updated = [
      ...tasks,
      { text: newTask, due: newDue || "", status: "未开始" }
    ];
    setTasks(updated);
    setNewTask("");
    setNewDue("");
  };

  const updateStatus = (index, status) => {
    const updated = [...tasks];
    updated[index].status = status;
    setTasks(updated);
  };

  const deleteTask = (index) => {
    const updated = [...tasks];
    updated.splice(index, 1);
    setTasks(updated);
  };

  return (
    <>
      <header>
        <button onClick={() => setPage("tasks")}>📋 任务管理 / Task Manager</button>
        <button onClick={() => setPage("cancel")}>🗃 待取消客户 / Cancellation List</button>
      </header>
      <div className="container">
        {page === "tasks" && (
          <>
            <div style={{ marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="任务内容 / Task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <input
                type="date"
                value={newDue}
                onChange={(e) => setNewDue(e.target.value)}
              />
              <button onClick={addTask}>➕ 添加 / Add</button>
            </div>
            <label>
              <input
                type="checkbox"
                checked={hideCompleted}
                onChange={() => setHideCompleted(!hideCompleted)}
              /> 隐藏已完成 / Hide Completed
            </label>
            {tasks
              .filter(t => !hideCompleted || t.status !== "已完成")
              .map((task, i) => (
                <div
                  key={i}
                  className={`task ${task.due === today ? "today" : ""} ${task.status === "已完成" ? "completed" : ""}`}
                >
                  <strong>{task.text}</strong><br />
                  截止日期 / Due: {task.due || "无"}<br />
                  状态 / Status: {task.status}
                  <br />
                  <button onClick={() => updateStatus(i, "进行中")}>⏳ 进行中</button>
                  <button onClick={() => updateStatus(i, "已完成")}>✅ 已完成</button>
                  <button onClick={() => deleteTask(i)}>🗑 删除</button>
                </div>
              ))}
          </>
        )}
        {page === "cancel" && (
          <>
            {cancels.map((c, i) => (
              <div key={i} className="task">
                <strong>{c.client}</strong><br />
                终止时间 / End: {c.end || "无"}<br />
                状态 / Status: {c.status}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
