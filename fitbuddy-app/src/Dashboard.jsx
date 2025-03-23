import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 

const Dashboard = () => {
const navigate = useNavigate();
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
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </nav>
        </header>
        <h1>Welcome {username}, Here is the Dashboard.</h1>
        <h2>It is the protected page for when a user is directed to when authenticated</h2>
      </div>
    );
    };
    
    export default Dashboard;