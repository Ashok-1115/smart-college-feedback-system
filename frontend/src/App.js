import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import StudentDashboard from './Pages/StudentDashboard';
import SubmitComplaint from './Pages/SubmitComplaint';
import AdminDashboard from './Pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/submit-complaint" element={<SubmitComplaint />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;