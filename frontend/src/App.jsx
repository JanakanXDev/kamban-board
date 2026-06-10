import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");

  const fetchTasks = async () => {
    const res = await axios.get("https://kamban-board-rslf.onrender.com/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title) return;

    await axios.post("https://kamban-board-rslf.onrender.com/tasks", {
      title,
      priority,
      status: "Todo"
    });

    setTitle("");
    fetchTasks();
  };

  const advanceTask = async (task) => {
    let newStatus = task.status;

    if (task.status === "Todo") newStatus = "Progress";
    else if (task.status === "Progress") newStatus = "Done";

    await axios.put(
      `https://kamban-board-rslf.onrender.com/tasks/${task._id}`,
      {
        ...task,
        status: newStatus
      }
    );

    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(
      `https://kamban-board-rslf.onrender.com/tasks/${id}`
    );

    fetchTasks();
  };

  const todo = tasks.filter(t => t.status === "Todo");
  const progress = tasks.filter(t => t.status === "Progress");
  const done = tasks.filter(t => t.status === "Done");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quick Task Kanban Board</h1>

      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <button onClick={addTask}>
        Add Task
      </button>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        {[["Todo", todo], ["Progress", progress], ["Done", done]]
          .map(([name, list]) => (
            <div key={name}>
              <h2>{name}</h2>

              {list.map(task => (
                <div
                  key={task._id}
                  style={{
                    border: "1px solid black",
                    margin: "10px",
                    padding: "10px"
                  }}
                >
                  <p>{task.title}</p>
                  <p>{task.priority}</p>

                  {task.status !== "Done" && (
                    <button
                      onClick={() =>
                        advanceTask(task)
                      }
                    >
                      Advance
                    </button>
                  )}

                  <button
                    onClick={() =>
                      deleteTask(task._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;