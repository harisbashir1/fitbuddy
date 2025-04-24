import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
  const token = localStorage.getItem('token');

  const [goal, setGoal] = useState('');
  const [currentGoal, setCurrentGoal] = useState(null);
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const response = await fetch('http://localhost:5051/getGoal', {
          method: 'GET',
          headers: {
            'Authorization': token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.frequency) {
            setCurrentGoal(data.frequency);
          }
        } else {
          console.error('Failed to fetch goal');
        }
      } catch (error) {
        console.error('Error fetching goal:', error);
      }
    };

    fetchGoal();
  }, []);

  const handleGoalSubmit = async () => {

    try {
      const response = await fetch('http://localhost:5051/setGoal', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ frequency: goal }),
      });

      if (response.ok) {
        setCurrentGoal(goal);
        setGoal('');
      } else {
      }
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  
    return (
      <div>
        <header>
          <nav>
            <ul>
              <li><Link to="/Dashboard">Home</Link></li>
              <li><Link to="/Friends">Friends</Link></li>
            </ul>
          </nav>
          <hr></hr>
        </header>
        <main>
          <h1>Profile</h1>
          <h2>Set your goal</h2>
          {currentGoal !== null && (
          <p>✅ Current goal: {currentGoal} workouts per week</p>
        )}
          <p>Update Goal</p>
          <input
          type="number"
          min="1"
          max="7"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <button onClick={handleGoalSubmit}>Save Goal</button>


        </main>
      </div>
    );
    };
    
    export default Profile;