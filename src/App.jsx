import React, { useEffect, useState } from 'react';


export default function App() {

  // Initialisation de l'état à partir du localStorage
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    try {
      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
      return [];
    }
  });
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect (() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos])

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const todo = {
      text: formData.get('todo'),
      id: Date.now(),
    }


    setTodos((prevTodos) => [...prevTodos, todo]);
    e.target.reset();
  };

  const onDelete = async (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }

  const onEdit = async (id, currentText) => {
    setEditId(id);
    setEditText(currentText);
  }

  const onSave = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo // Modifie uniquement la tâche correspondante
      )
    );
    setEditId(null);
    setEditText("");
  }
  
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className='text-center text-xl font-bold'>Ma todoList</h1>
      <form 
        className="flex items-center gap-2"
        onSubmit={onSubmit}
      >
        <input name="todo" className='border border-zinc-700 rounded-md px-2 py-3 flex-1' />

        <button type='submit' className='border rounded-md px-4 py-3 bg-zinc-800 text-white'>
          Add
        </button>

      </form>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="w-full flex justify-between bg-zinc-700 text-white py-2 px-2 mb-2"
          >
            {editId === todo.id ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)} // Mise à jour du texte temporaire
                  className="border border-zinc-500 rounded-md px-2 py-1 flex-1 text-zinc-700"
                />
                <button
                  onClick={() => onSave(todo.id)}
                  className="text-green-500 font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-between flex-1">
                <span>{todo.text}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(todo.id, todo.text)} // Active le mode édition
                    className="text-blue-500 font-bold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(todo.id)} // Supprime la tâche
                    className="text-red-500 font-bold"
                  >
                    ❌
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

    </div>
  )
}