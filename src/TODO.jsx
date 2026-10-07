import "./TODO.css";
import axios from "axios";
import { useEffect, useState } from "react";

export function TODO() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    axios
      .get("https://todo-backend-e88b.onrender.com/api")
      .then((response) => {
        setTodos(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }, []);
  function handleKeyPress(event) {
    if (event.key === "Enter") {
      addTodo();
    }
  }
  const addTodo = async () => {
    if (!title.trim()) {
      return;
    }
    try {
      const response = await axios.post("https://todo-backend-e88b.onrender.com/api/add", {
        title,
      });
      setTodos((prevTodos) => [...prevTodos, response.data.data]);
      setTitle("");
      console.log(response.data);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };
  const deleteTodo = async (id) => {
    try {
      axios.delete(`https://todo-backend-e88b.onrender.com/api/${id}`)
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const response = await axios.patch(
       `https://todo-backend-e88b.onrender.com/api/${id}/toggle`
      );
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === id ? response.data.data : todo)),
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const editTodo = async (id) => {
    try {
      const response = await axios.put(`https://todo-backend-e88b.onrender.com/api/${id}`, {
        title: editTitle,
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === id ? response.data.data : todo)),
      );
      setEditingId(null);
      setEditTitle("");
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };
  return (
    <>
      <h1 className="todo-title">My Todo List</h1>
      <div className="todo-form">
        <input
          className="todo-input"
          type="text"
          placeholder="Add a new todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="add-btn" onClick={addTodo}>
          Add Todo
        </button>
      </div>
      <ul>
        {todos.map((todo) => {
          return (
            <li key={todo._id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => toggleTodo(todo._id)}
              />
              <span>
                {editingId === todo._id ? (
                  <input
                    type="text"
                    className="edit-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                ) : (
                  <p>{todo.title}</p>
                )}
              </span>
              {editingId === todo._id ? (
                <button onClick={() => editTodo(todo._id)} className="edit-btn">
                  <i className="fa-solid fa-thumbs-up"></i>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditTitle(todo.title);
                    setEditingId(todo._id);
                  }}
                  className="edit-btn"
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
              )}
              <button
                onClick={() => deleteTodo(todo._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
