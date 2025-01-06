import React from 'react';
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Home from './components/teacher/Home';
import Dashboard from './components/student/Dashboard';
import StudentManagement from './components/teacher/StudentManagement';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/StudentManagement" element={<StudentManagement />} />
      </Routes>
    </Router>
  )
}

export default App;