import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 

const Friends = () => {
const navigate = useNavigate();
const [username, setUsername] = useState(null);
const [userID, setUserID] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.username);
      setUserID(decodedToken.userID)
    } 
    else {
      navigate('/login');
    }
  }, [navigate]);

  const [friends, setFriends] = useState([]);


useEffect(() => {
    if (userID) {
      fetch(`http://localhost:5050/friendslist/${userID}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then((response) => response.json())
        .then((data) => setFriends(data))
        .catch((error) => console.error('Error fetching friends:', error));
    }
  }, [userID]); 



    return (
      <div>
        <header>
          <nav>
            <ul>
            <li><Link to="/Dashboard">Home</Link></li>
              <li><Link to="/UserProfile">Profile</Link></li>
            </ul>
          </nav>
        </header>
        <h1>Welcome {username}, Here is the Friends Page.</h1>
        <p>test {userID} {username}</p>
        <h2>Add a friend</h2>
        <h2>My friends list</h2>
        {friends.length === 0 ? (
        <p>No friends found.</p>
      ) : (
        <ul>
          {friends.map((friend) => (
            <li key={friend.userID}>{friend.username}</li>
          ))}
        </ul>
      )}
      </div>
    );
    };
    
    export default Friends;