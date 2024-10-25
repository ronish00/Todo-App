import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './App.css'
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function App() {
  const [todos, setTodos] = useState([]);
  const [item, setItem] = useState();
  const [editItem, setEditItem] = useState(null);
  const [editValue, setEditValue] = useState("");

  const inputRef = useRef(null);

  const handleClick = () => {
    axios
      .post("http://localhost:3000/add", {
        item: item,
      })
      .then((result) => {
        location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3000/delete/" + id)
      .then((result) => {
        location.reload();
      })
      .catch((err) => console.log(err));
  };

  const updateItem = (todo) => {
    setEditItem(todo._id);
    setEditValue(todo.item);
    inputRef.current.focus();
  };

  const handleUpdate = (id) => {
    axios.put("http://localhost:3000/update/" + id, {
      item: editValue
    })
    .then((result) => {
      location.reload();
    })
    .catch((err) => console.log(err))
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/get")
      .then((result) => setTodos(result.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="px-72">
      <h1 className="text-3xl font-bold text-violet-600 mb-12">TODO LIST</h1>
      <form className="mb-11 text-start flex w-full">
        <input
          type="text"
          className="border rounded py-2 px-5 w-full"
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
