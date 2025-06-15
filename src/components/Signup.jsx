import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner'; // ✅ Import the Spinner

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false); // ✅ loading state

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Show spinner

    try {
      const response = await fetch('https://backend-notbook-app.onrender.com/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setLoading(false); // ✅ Hide spinner

      if (!response.ok) {
        return alert(data.message || "Signup failed");
      }

      alert("Signup successful!");
      navigate('/login');
    } catch (error) {
      setLoading(false); // ✅ Hide spinner on error
      console.error("Signup error:", error);
      alert("Something went wrong during signup");
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      {loading ? (
        <Spinner /> // ✅ Spinner component when loading
      ) : (
        <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
          <h4 className="mb-3 text-center">Signup</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input 
                type="text" 
                name="name" 
                className="form-control" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                name="email" 
                className="form-control" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                name="password" 
                className="form-control" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-success w-100">Signup</button>
          </form>
        </div>
      )}
    </div>
  );
}
