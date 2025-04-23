import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 

const Dashboard = () => {
const navigate = useNavigate();


const [workoutType, setWorkoutType] = useState('');
const [mood, setMood] = useState('');
const [note, setNote] = useState('');
const handleSubmit = (e) => {
    e.preventDefault();

    if (!workoutType) {
      alert('Workout type is required');
      return;
    }

    console.log({
      workoutType,
      mood: mood || null,
      note: note || null,
    });

    // Clear form after submission
    setWorkoutType('');
    setMood('');
    setNote('');
  };

const [username, setUsername] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.username);
    } 
    else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    navigate('/'); // Redirect to landing page
  };




  
    return (
      <div>
        <header>
          <nav>
            <ul>
              <li><Link to="/UserProfile">Profile</Link></li>
              <li><Link to="/Friends">Friends</Link></li>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </ul>
          </nav>
          <hr></hr>
        </header>
        <h1>Welcome {username}, Here is the Dashboard.</h1>
        <h2>It is the protected page for when a user is directed to when authenticated</h2>
        <div className ="entry-form">
        <form onSubmit={handleSubmit}>
      {/* Workout Type */}
      <div >
        <label>Workout Type *</label>
        <input
          type="text"
          value={workoutType}
          onChange={(e) => setWorkoutType(e.target.value)}
          required
        />
      </div>

      {/* Mood */}
      <div>
        <label>Mood (1-5)</label>
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="">Select mood</option>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </div>

      {/* Note */}
      <div>
        <label>Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows="3"
          placeholder="Add any notes about your workout..."
        />
      </div>

      {/* Submit Button */}
      <button type="submit">Log Workout</button>
    </form>
    </div>
      </div>
    );
    };
    
    export default Dashboard;