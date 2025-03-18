import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Landing from './Landing';
import UserProfile from './UserProfile'
import Dashboard from './Dashboard'
import './App.css';

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Landing />} /> 
      <Route path="/Dashboard" element={<Dashboard/>} /> 
      <Route path="/UserProfile" element={<UserProfile />} />
    </Routes>
  </Router>
  );
}

export default App
