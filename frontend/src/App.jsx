import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './App.css'
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function App() {
  const [todos, setTodos] = useState([]);
  const [item, setItem] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [editValue, setEditValue] = useState("");

  const inputRef = useRef(null);

  const handleClick = (e) => {
    e.preventDefault();
    if (!item) return; // Prevent adding empty todos
    axios
      .post("https://todo-app-pp1t.onrender.com/add", {
        item: item,
      })
      .then((result) => {
        setTodos((prev) => [result.data, ...prev]);
        setItem(''); // Clear the input field only after successful addition
      })
      .catch((err) => {
        console.log(err);
        alert("Error adding todo"); // Optional: notify the user of the error
      });
  };
  
  const handleDelete = (id) => {
    axios
      .delete("https://todo-app-pp1t.onrender.com/delete/" + id)
      .then((result) => {
        setTodos((prev) => prev.filter(todo => todo._id !== id))
      })
      .catch((err) => console.log(err));
  };

  const updateItem = (todo) => {
    setEditItem(todo._id);
    setEditValue(todo.item);
    inputRef.current.focus();
  };

  const handleUpdate = (id) => {
    axios.put("https://todo-app-pp1t.onrender.com/update/" + id, {
      item: editValue,
    })
    .then((result) => {
      setTodos((prev) => 
        prev.map(todo => 
          todo._id === id ? { ...todo, item: editValue } : todo
        )
      );
      setEditItem(null); // Clear the edit state after updating
      setEditValue(''); // Clear the edit input
    })
    .catch((err) => console.log(err));
  };
  
  useEffect(() => {
    axios
      .get("https://todo-app-pp1t.onrender.com/get")
      .then((result) => {
        setTodos(result.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="2xl:px-72 sm:px-4 lg:px-56">
      <h1 className="text-3xl font-bold text-violet-600 mb-12">TODO LIST</h1>
      <form className="mb-11 text-start flex w-full">
        <input
          type="text"
          className="border rounded py-2 px-5 w-full"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="Add Todo List"
        />
        <button
          className="bg-violet-600 py-2 px-5 rounded text-white ml-3"
          onClick={handleClick}
        >
          Add
        </button>
      </form>
      {todos.length === 0 ? (
        <h2>Empty Todo List</h2>
      ) : (
        todos.map((todo) => (
          <div
            className="group flex justify-between mb-7 bg-white shadow-md h-20 p-6 w-full text-start rounded"
            key={todo._id}
          >
            {todo._id === editItem ? (
              <input
                type="text"
                className="border border-black rounded py-2 px-5"
                value={editValue}
                ref={inputRef}
                onChange={(e) => setEditValue(e.target.value)}
              />
            ) : (
              <p>{todo.item}</p>
            )}
            <div className="flex items-center gap-4">
              {editItem === todo._id ? (
                <button
                  onClick={() => handleUpdate(todo._id)}
                  className="text-green-700"
                >
                  Save
                </button>
              ) : (
                <button
                  className="hidden group-hover:inline-block"
                  onClick={() => updateItem(todo)}
                >
                  <EditIcon className="text-gray-700" />
                </button>
              )}
              <button
                className="hidden group-hover:inline-block"
                onClick={() => handleDelete(todo._id)}
              >
                <DeleteIcon className="text-red-700" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
