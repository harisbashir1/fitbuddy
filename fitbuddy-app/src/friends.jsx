import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 

const Friends = () => {
const navigate = useNavigate();
const [username, setUsername] = useState(null);
const [userID, setUserID] = useState(null);


const [incomingFriendRequests, setIncomingFriendRequests] = useState([]);
useEffect(() => {
  if (userID) {
    fetch(`http://localhost:5051/friendRequests/${userID}`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => setIncomingFriendRequests(data))
      .catch((error) => console.error('Error fetching friend requests:', error));
  }
}, [userID]);





  const handleSendFriendRequest = async (receiverId) => {
    const requestBody = {
      senderId: userID,
      receiverId: receiverId,
    };
    try {
      const response = await fetch('http://localhost:5051/friendRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify(requestBody)
      })
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send friend request.');
      }
      alert(data.message);
    } catch (error) {
      alert(error.message);
    }
  };


  const handleAcceptFriendRequest = async (requestId) => {
    const requestBody = {
      senderId: requestId,
      receiverId: userID,
    };
    try {
      const response = await fetch(`http://localhost:5051/acceptFriendRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to accept friend request.');
      }

      // Update the state to reflect changes after accepting
      setIncomingFriendRequests((prevRequests) => 
        prevRequests.filter((request) => request.request_id !== requestId)
      );

    } catch (error) {
      alert(error.message);
    }
  };


  const handleRejectFriendRequest = async (requestId) => {
    const requestBody = {
      senderId: requestId,
      receiverId: userID,
    };
    try {
      const response = await fetch(`http://localhost:5051/rejectFriendRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject friend request.');
      }

      // Update the state to reflect changes after rejecting
      setIncomingFriendRequests((prevRequests) => 
        prevRequests.filter((request) => request.request_id !== requestId)
      );

    } catch (error) {
      alert(error.message);
    }
  };

const [searchUsername, setSearchUsername] = useState('');
const [userSearchResults, setUserSearchResults] = useState([]);
const searchUsers = async() => {
    if (!searchUsername) {
      alert('Please enter a username to search.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5051/searchUsers?username=${searchUsername}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to send request');
      }
      const data = await response.json();
      setUserSearchResults(data);
    } catch (error) {
      alert(error.message);
    }
  };

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
      fetch(`http://localhost:5051/friendslist/${userID}`, {
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
          <hr></hr>
        </header>
        <h1>Welcome {username}, Here is the Friends Page.</h1>
        <h2>Friend Requests</h2>
        {incomingFriendRequests.length === 0 ? (
          <p>No pending friend requests.</p>
        ) : (
          <ul>
            {incomingFriendRequests.map((request) => (
              <li key={request.userID}>
                {request.username}
                <button onClick={() => handleAcceptFriendRequest(request.userID)}>Accept</button>
                <button onClick={() => handleRejectFriendRequest(request.userID)}>Reject</button>
                </li>
            ))}
          </ul>
        )}

        <h2>Add a friend</h2>
        <input
        type="text"
        placeholder="Search by username"
        value={searchUsername}
        onChange={(e) => setSearchUsername(e.target.value)}
      />
      <button onClick={searchUsers}>Search</button>
      {userSearchResults.length > 0 && (
  <div>
    <h3>Search Results:</h3>
    <ul>
      {userSearchResults.map((user) => {
      const isYou = user.userID === userID;
      const isFriend = friends.some(friend => friend.userID === user.userID);

      return (
        <li key={user.userID}>
          {user.username}
          {isYou ? (
            <span> (You)</span>
          ) : isFriend ? (
            <span> (Friends)</span>
          ) : (
            <button onClick={() => handleSendFriendRequest(user.userID)}>Send Request</button>
          )}
        </li>
      );
    }
  )}
    </ul>
  </div>
  )}
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