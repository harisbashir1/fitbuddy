import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 
import WorkoutCalendar from './workoutCalendar';




const Dashboard = () => {
const navigate = useNavigate();


const [streak, setStreak] = useState(0);
const [remainingThisWeek,setRemainingThisWeek] = useState(null);
useEffect(() => {
  const fetchStreakInfo = async () => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const userID = decoded.userID;
    try {
      const response = await fetch(`http://localhost:5051/getStreakInfo/${userID}`, {
        method: 'GET',
        headers: {
          'Authorization': token,
        },
      });

      if (response.status === 404) {
        // No goal set yet — handle gracefully
        setStreak(0);
        setRemainingThisWeek(null); 
        return; // Stop further processing
      }

      if (!response.ok) {
        throw new Error('Failed to fetch streak info');
      }

      const data = await response.json();
      setStreak(data.goal_streak); 
      setRemainingThisWeek(data.remainingWorkouts); 
    } catch (error) {
      console.error('Error fetching workout dates:', error);
      alert(error.message);
    }
  };

  fetchStreakInfo();
}, []);

const [workoutType, setWorkoutType] = useState('');
const [mood, setMood] = useState('');
const [note, setNote] = useState('');


const [workoutDates, setWorkoutDates] = useState([]);
useEffect(() => {
  const fetchWorkoutDates = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5051/getWorkoutDates', {
        method: 'GET',
        headers: {
          'Authorization': token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workout dates.');
      }

      const dates = await response.json();
      setWorkoutDates(dates); 
    } catch (error) {
      console.error('Error fetching workout dates:', error);
      alert(error.message);
    }
  };

  fetchWorkoutDates();
}, [navigate]);




const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!workoutType) {
      alert('Workout type is required');
      return;
    }
    try {
      const response = await fetch('http://localhost:5051/logWorkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          workout_type: workoutType,
          mood: mood || null,
          note: note || null,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to log workout.');
      }
  
      alert('Workout logged successfully!');
  
      // Clear form after submission
      setWorkoutType('');
      setMood('');
      setNote('');
  
    } catch (error) {
      console.error('Error submitting workout:', error);
      alert(error.message);
    }
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
        <h1>Welcome, {username}</h1>

          <p className='streak-labels'><strong>{streak}</strong> weeks🔥🔥🔥 (Updates at the end of week)</p>
          {remainingThisWeek === null ? (
              <p className='streak-labels'>Set a goal in your <Link to="/userProfile">profile</Link> to start tracking your streak!</p>
            ) : (
              <p className='streak-labels'>Log <strong>{remainingThisWeek}</strong> more workouts this week to add to the streak!</p>
            )}
        <div class="card-container">
        <h2>Workout Calendar</h2>
        <WorkoutCalendar workoutDates={workoutDates} />
        </div>
        <div class="card-container">
        <h2>Log today's workout</h2>
        <h3>Congrats on checking in!</h3>
        <div className ="entry-form">
        <form onSubmit={handleSubmit}>
      <div >
        <label>Workout Type *</label>
        <input
          type="text"
          value={workoutType}
          onChange={(e) => setWorkoutType(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Mood (1-5)</label>
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="">Select mood</option>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows="3"
          placeholder="Add any notes about your workout..."
        />
      </div>

      <button type="submit">Log Workout</button>
    </form>
    </div>
    </div>
    <div className="card-container">
        <h2>Filter Data</h2>
    </div>

    <div className="card-container">
        <h2>Friend Activity</h2>
    </div>
      </div>
    );
    };
    
    export default Dashboard;