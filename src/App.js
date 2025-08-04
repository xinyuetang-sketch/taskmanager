import React, { useState, useEffect } from "react";
import "./styles.css";

export default function App() {
  const defaultTasks = [
    { text: "临商银行：申请折扣", due: "2025-08-08", status: "未开始" },
    { text: "FFT Investment：税务审批", due: "2025-08-08", status: "商务审批中" },
    { text: "Siemens Energy：沟通汇率问题", due: "2025-08-08", status: "进行中" },
    { text: "CC：沟通 overusage", due: "2025-08-15", status: "进行中" },
    { text: "电建（畅姐）：发取消通知信", due: "", status: "未开始" },
    { text: "乌鲁木齐银行：合同+说明", due: "2025-08-15", status: "未开始" },
    { text: "国信证券：准备投标标书", due: "", status: "未开始" },
    { text: "催 Adela 回大众", due: "2025-08-05", status: "未开始" },
    { text: "PI 2026 Exception", due: "2025-08-08", status: "未开始" },
    { text: "国信证券投标平台注册", due: "2025-08-05", status: "未开始" },
    { text: "钱老师 & OMS 开会", due: "2025-08-05", status: "未开始" }
  ];

  const defaultCancel = [
    { client: "中南政法大学", end: "2025-12-31", status: "月底前完成取消流程" },
    { client: "粤铁投", end: "2025-12-31", status: "等待后续操作" },
    { client: "8Mile", end: "", status: "待客户反馈，年底确认是否取消" },
    { client: "电建（畅姐）", end: "", status: "待取消，未发通知" },
    { client: "厦门明穗", end: "2025-11-30", status: "系统已提取消，8 月 book，8 月确认 book 完成" }
  ];

  const [page, setPage] = useState("tasks");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : defaultTasks;
  });
  const [cancels, setCancels] = useState(() => {
    const saved = localStorage.getItem("cancels");
    return saved ? JSON.parse(saved) : defaultCancel;
  });
  const [hideCompleted, setHideCompleted] = useState(false);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("cancels", JSON.stringify(cancels));
  }, [cancels]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <header>
        <button onClick={() => setPage("tasks")}>📋 任务管理 / Task Manager</button>
        <button onClick={() => setPage("cancel")}>🗃 待取消客户 / Cancellation List</button>
      </header>
      <div className="container">
        {page === "tasks" && (
          <>
            <label>
              <input
                type="checkbox"
                checked={hideCompleted}
                onChange={() => setHideCompleted(!hideCompleted)}
              /> 隐藏已完成任务 / Hide Completed
            </label>
            {tasks
              .filter(t => !hideCompleted || t.status !== "已完成")
              .map((task, i) => (
                <div
                  key={i}
                  className={`task ${task.due === today ? "today" : ""} ${task.status === "已完成" ? "completed" : ""}`}
                >
                  <strong>{task.text}</strong><br />
                  截止日期 / Due: {task.due ? task.due.replace(/-/g, "年").replace("年", "年").replace(/-/, "月") + "日" : "无"}<br />
                  状态 / Status: {task.status}
                </div>
              ))}
          </>
        )}
        {page === "cancel" && (
          <>
            {cancels.map((c, i) => (
              <div key={i} className="task">
                <strong>{c.client}</strong><br />
                终止时间 / End Date: {c.end ? c.end.replace(/-/g, "年").replace("年", "年").replace(/-/, "月") + "日" : "无"}<br />
                状态 / Status: {c.status}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
