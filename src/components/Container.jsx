import React, { useState, useEffect } from 'react';
import Card from './Card';
import Spinner from './Spinner'; // ✅ import spinner
import '../App.css';
import { useNavigate } from 'react-router-dom';

export default function Container() {
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false); // ✅ loading state

  // Redirect to login if token not found
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch all todos
  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true); // ✅ show spinner
      try {
        const response = await fetch('https://backend-notbook-app.onrender.com/crud/fetch', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();
        if (!response.ok) {
          alert(data.message || "Failed to fetch todos");
        } else {
          setTodos(data.userdata);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Failed to fetch todos");
      }
      setLoading(false); // ✅ hide spinner
    };

    fetchdata();
  }, []);

  // CREATE Todo Handler
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !desc) return alert("Both fields are required");

    setLoading(true); // ✅ show spinner

    try {
      const response = await fetch('https://backend-notbook-app.onrender.com/crud/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, desc })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error creating todo");
      } else {
        setTodos([data.userdata, ...todos]); // prepend new todo
        setTitle('');
        setDesc('');
      }
    } catch (error) {
      console.error("Create Todo Error:", error);
      alert("Something went wrong while creating todo");
    }

    setLoading(false); // ✅ hide spinner
  };

  return (
    <div className="w-100 min-vh-100 bg-dark text-white">
      <div className="container py-4">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <Spinner /> {/* ✅ Spinner when loading */}
          </div>
        ) : (
          <>
            {/* Create Todo Form */}
            <form onSubmit={handleCreate} className="mb-4">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  placeholder="Description"
                  rows="2"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-success w-100">Create Todo</button>
            </form>

            {/* Todo Cards Grid */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {todos.map(todo => (
                <div className="col" key={todo._id || todo.id}>
                  <Card title={todo.title} desc={todo.desc} id={todo._id} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
