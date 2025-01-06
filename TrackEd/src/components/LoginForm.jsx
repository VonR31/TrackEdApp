import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  // Sample users with roles
  const users = [
    { email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { email: 'teacher@example.com', password: 'teacher123', role: 'teacher' },
    { email: 'student@example.com', password: 'student123', role: 'student' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = users.find(
      user => user.email === formData.email && user.password === formData.password
    );

    if (user) {
      console.log('Logged in as:', user.role);
      switch (user.role) {
        case 'admin':
          navigate('/admin'); // Navigate to Admin dashboard
          break;
        case 'teacher':
          navigate('/home'); // Navigate to Teacher dashboard
          break;
        case 'student':
          navigate('/dashboard'); // Navigate to Student dashboard
          break;
        default:
          alert('Invalid role!');
      }
    } else {
      alert('Invalid email or password.');
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
