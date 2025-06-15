import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner'; // import your spinner component

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // ✅ initial should be false

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // show spinner

    try {
      const response = await fetch('https://backend-notbook-app.onrender.com/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false); // hide spinner

      if (data.success) {
        localStorage.setItem('token', data.token);
        alert('Login success');
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      setLoading(false);
      alert('Login failed. Please try again.');
      console.error('Login Error:', error);
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <h4 className="mb-3 text-center">Login</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
