import React, { useState } from 'react';
import '../App.css'; // Optional CSS

export default function Card(props) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState(props.title); // local state for editing
  const [desc, setDesc] = useState(props.desc);   // local state for editing

  const handleSave = async () => {
    try {
      const response = await fetch(`https://backend-notbook-app.onrender.com/crud/update/${props.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, desc })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update todo");
        return;
      }

      alert("Todo updated successfully");
      setShowModal(false);
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating todo");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;

console.log(props.id)
    try {
      const response = await fetch(`https://backend-notbook-app.onrender.com/crud/delete/${props.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete todo");
        return;
      }

      alert("Todo deleted successfully");
      window.location.reload(); // or use a prop callback to update parent state
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting todo");
    }
  };

  return (
    <>
      {/* Main Card */}
      <div className={`card w-100 card-item ${showModal ? 'blur-bg' : ''}`} style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <h5 className="card-title">{props.title}</h5>
          <p className="card-text">{props.desc}</p>
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Edit</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>

      {/* Modal for Editing */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content-box">
            <h5>Edit Todo</h5>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="form-control mb-2"
            />
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description"
              className="form-control mb-3"
              rows="3"
            />
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
