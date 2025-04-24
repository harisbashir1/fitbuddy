import React, { useEffect, useState } from 'react';
import WorkoutCalendar from './workoutCalendar';
import { useParams, useNavigate, Link } from 'react-router-dom';





const FriendProfile = () => {
    const navigate = useNavigate();

  const { friendID } = useParams();
  const [profile, setProfile] = useState(null);
  

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:5051/friendProfile/${friendID}`, {
      headers: { Authorization: token },
    })
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error(err));
  }, [friendID]);


  const [workoutDates, setWorkoutDates] = useState([]);
  useEffect(() => {
    const fetchWorkoutDates = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5051/getWorkoutDates?friendID=${friendID}`, {
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

  if (!profile) {
    return <p>Loading profile...</p>;
  }


  return (
    <div>
          <nav>
            <ul>
            <li><Link to="/Dashboard">Home</Link></li>
            <li><Link to="/Friends">Friends</Link></li>
              <li><Link to="/UserProfile">Profile</Link></li>
            </ul>
          </nav>
      <h2>{profile.username}'s Profile</h2>

      <div className="card-container">
        <h2>Workout Calendar</h2>
        <WorkoutCalendar workoutDates={workoutDates || []} />
      </div>
    </div>
  );
};

export default FriendProfile;