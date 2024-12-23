import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate login validation
    if (formData.email && formData.password) {
      console.log('Form submitted:', formData);
      navigate('/home'); // Navigate to Home
    } else {
      alert('Please fill out both fields.');
    }
  };

  return (
    <div className="main-container">
      <header className="header" />

      <main className="main-content">
        <div className="login-card">
          <h1 className="login-title">LOG-IN</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="submit-button">
              Sign In
            </button>
          </form>
        </div>
      </main>

      <footer className="footer" />
    </div>
  );
}

export default LoginForm;