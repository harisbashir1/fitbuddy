const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getISOWeek } = require('date-fns');
const app = express();
const PORT = 5051;

app.use(bodyParser.json());
app.use(cors());

//create mySQL connection
const db = mysql.createConnection({
    host: 'localhost',  
    user: 'root',       
    password: '',      
    database: 'Fitbuddy', 
  });

// Connect to the MySQL database
db.connect(err => {
    if (err) {
      console.error('Database connection failed:', err.stack);
      return;
    }
    console.log('Connected to MySQL database.');
  });

    // Start the server and listen on port defined
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });

app.post('/register', async (req, res) => {
    const { username, firstName, lastName, password } = req.body;  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Insert the new user into the 'users' table
    db.execute(
      'INSERT INTO users (username, firstname, lastname, password) VALUES (?, ?, ?, ?)',
      [username, firstName, lastName, hashedPassword],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'User registration failed', error: err }); 
        }
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });

// User login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;  // Extract username and password from request body
  
    // Query the database for the user with the provided username
    db.execute('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({ message: 'User not found' });  // Send error response if user is not found
      }
  
      const user = results[0];  // Get the user record from the query result
      const passwordMatch = await bcrypt.compare(password, user.password);  // Compare the provided password with the hashed password
  
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });  // Send error response if the password does not match
      }
  
      // Generate a JWT token with the user ID and a secret key, valid for 3 hour
      const token = jwt.sign({ username: user.username, userID: user.userID }, 'your_jwt_secret', { expiresIn: '3h' });
  
      // Send the JWT token as the response
      res.json({ token });
    });
  });

// Middleware function to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];  // Get the token from the 'Authorization' header
  
    if (!token) return res.status(401).json({ message: 'Access denied' });  // If no token is provided, deny access
  
    // Verify the JWT token
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });  // If the token is invalid, send a 403 error
      req.user = user; // Store the decoded user data in the request object
      next();  // Proceed to the next middleware/route handler
    });
  };

  app.post('/friendRequest', async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;
      console.log(senderId, receiverId);
      if (senderId === receiverId) {
        return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
      }

      db.query(
        'INSERT INTO friend_requests (sender_id, receiver_id) VALUES (?, ?)',
        [senderId, receiverId]
      );
      res.status(201).json({ message: 'Friend request sent' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send friend request' });
    }
  });

  app.get('/friendRequests/:userId', (req, res) => {
    const { userId } = req.params;
  
    db.query(
      `SELECT fr.sender_id AS userID, u.username
       FROM friend_requests fr
       JOIN users u ON fr.sender_id = u.userID
       WHERE fr.receiver_id = ?  AND fr.status = 'pending'`,
      [userId],
      (err, results) => {
        if (err) {
          console.error('Error fetching friend requests:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        res.json(results);
      }
    );
  });

  // Reject Friend Request
app.post('/rejectFriendRequest', (req, res) => {
  const { senderId, receiverId } = req.body;

  // Update friend request status to 'rejected'
  db.query(
    'UPDATE friend_requests SET status = "rejected" WHERE sender_id = ? AND receiver_id = ?',
    [senderId, receiverId],
    (err, results) => {
      if (err) {
        console.error('Error rejecting friend request:', err);
        return res.status(500).json({ message: 'Error rejecting friend request' });
      }

      res.status(200).json({ message: 'Friend request rejected' });
    }
  );
});

// Accept Friend Request
app.post('/acceptFriendRequest', (req, res) => {
  const { senderId, receiverId } = req.body;

  // Update friend request status to 'accepted'
  db.query(
    'UPDATE friend_requests SET status = "accepted" WHERE sender_id = ? AND receiver_id = ?',
    [senderId, receiverId],
    (err, results) => {
      if (err) {
        console.error('Error accepting friend request:', err);
        return res.status(500).json({ message: 'Error accepting friend request' });
      }

      // Create a new friendship record in the 'friendships' table
      db.query(
        'INSERT INTO friendships (userID1, userID2) VALUES (?, ?)',
        [senderId, receiverId],
        (err, results) => {
          if (err) {
            console.error('Error creating friendship:', err);
            return res.status(500).json({ message: 'Error creating friendship' });
          }

          res.status(200).json({ message: 'Friend request accepted and friendship created' });
        }
      );
    }
  );
});



app.get('/friendslist/:userId', (req, res) => {
    const { userId } = req.params;  // Extract userId from the URL parameter
  
    // Query to fetch friends based on userId
    db.query(
      `SELECT u.userID, u.username
       FROM friendships f
       JOIN users u ON 
         (f.userID1 = ? AND f.userID2 = u.userID) OR 
         (f.userID2 = ? AND f.userID1 = u.userID)`,
      [userId, userId],
      (err, results) => {
        if (err) {
          // Handle error and send appropriate response
          return res.status(500).json({ message: 'Failed to fetch friends list', error: err });
        }
        // Send results (friends list) as the response
        res.json(results);
      }
    );
  });

  app.get('/searchUsers', (req, res) => {
    const { username } = req.query;  // Extract userId from the URL parameter

  
    // Query to fetch friends based on userId
    db.query(
      `SELECT * FROM users WHERE username LIKE ?`,
      [`%${username}%`],
      (err, results) => {
        if (err) {
          // Handle error and send appropriate response
          return res.status(500).json({ message: 'Failed to fetch user list', error: err });
        }
        // Send results (friends list) as the response
        res.json(results);
      }
    );
  });


  app.post('/logWorkout', authenticateToken, (req, res) => {
    const {workout_type, mood, note} = req.body;
    const userID = req.user.userID; 
    const currentDate = new Date();
    db.query(`INSERT INTO workouts (workout_date, workout_type, mood, note, userID) VALUES (?, ?, ?, ?, ?)`,
       [currentDate, workout_type, mood || null, note || null, userID ], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to insert workout', error: err });
      }
      res.json(results);
    });
  });

  app.get('/getWorkoutDates', authenticateToken, (req, res) => {
    const userID = req.query.friendID || req.user.userID;
  
    db.query(
      'SELECT workout_date FROM workouts WHERE userID = ?',
      [userID],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to fetch workout dates', error: err });
        }
  
        const dates = results.map(row => {
          const dateObj = new Date(row.workout_date);
          return dateObj.toISOString().split('T')[0];
        });
  
        res.json(dates);
      }
    );
  });


  app.get('/friendProfile/:friendID', authenticateToken, (req, res) => {
    const { friendID } = req.params;
  
    db.query('SELECT username FROM users WHERE userID = ?', [friendID], (err, results) => {
      if (err) return res.status(500).json({ error: 'Error retrieving profile' });
      if (results.length === 0) return res.status(404).json({ message: 'User not found' });
  
      res.json(results[0]);
    });
  });

  app.post('/setGoal', authenticateToken,(req, res) => {
    const { frequency } = req.body;
    const userID = req.user.userID;
    console.log(frequency, userID);
  
    if (!frequency || frequency < 1 || frequency > 7) {
      return res.status(400).json({ error: 'Invalid frequency' });
    }
  
    const sql = `
    INSERT INTO user_goals (userID, frequency)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE frequency = VALUES(frequency)
  `;

    db.query(sql, [userID, frequency], (err, result) => {
      if (err) {
        console.error('Error saving goal:', err);
        return res.status(500).json({ error: 'Server error' });
      }
  
      res.json({ message: 'Goal saved successfully', frequency });
    });
  });


  app.get('/getGoal', authenticateToken, (req, res) => {
    const userID = req.user.userID;
  
    db.query(
      'SELECT frequency FROM user_goals WHERE userID = ?',
      [userID],
      (err, result) => {
        if (err) {
          console.error('Error fetching goal:', err);
          return res.status(500).json({ error: 'Server error' });
        }
  
        if (result.length > 0) {
          res.json(result[0]);
        } else {
          res.json({ frequency: null });
        }
      }
    );
  });


  app.get('/getStreakInfo/:userID', async (req, res) => {
    const userID = req.params.userID;
  
    try {
      const [goalRows] = await db.promise().query(
        'SELECT frequency, goal_streak, last_updated FROM user_goals WHERE userID = ?',
        [userID]
      );

      if (goalRows.length === 0) {
        return res.status(404).json({ message: 'no goal info found'});
      }
  
  
      const frequency = goalRows[0].frequency;
      var goal_streak = goalRows[0].goal_streak ;
      const lastUpdated = goalRows[0].last_updated;
  
      const today = new Date();
      // const today = new Date('2025-05-15');
      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay()); //to get Sunday


      const startOfLastWeek = new Date(firstDayOfWeek);
      startOfLastWeek.setDate(startOfLastWeek.getDate() - 7); //last sunday

      const endOfLastWeek = new Date(firstDayOfWeek);
      endOfLastWeek.setDate(endOfLastWeek.getDate() - 1); 

      const lastUpdatedDate = new Date(lastUpdated);
      const isSameWeek = getISOWeek(lastUpdatedDate) === getISOWeek(today); 

      console.log(`lastUpdated: ${lastUpdated}, today: ${today}, isSameWeek: ${isSameWeek}`);

      if (!isSameWeek) {
      const [workoutsLastWeek] = await db.promise().query(
        'SELECT COUNT(*) AS count FROM workouts WHERE userID = ? AND workout_date BETWEEN ? AND ?',
        [userID, startOfLastWeek, endOfLastWeek]
      );
  
      const completedLastWeek = workoutsLastWeek[0].count;
  
      if (completedLastWeek >= frequency) {
        goal_streak += 1;
      } else {
        goal_streak = 0;
      }
      

      await db.promise().query(
        'UPDATE user_goals SET goal_streak = ?, last_updated = ? WHERE userID = ?',
        [goal_streak, today, userID]
      );
    }
  
      const [workoutsThisWeek] = await db.promise().query(
        'SELECT COUNT(*) AS count FROM workouts WHERE userID = ? AND workout_date >= ?',
        [userID, firstDayOfWeek]
      );
  
      const completedThisWeek = workoutsThisWeek[0].count;
      const remainingWorkouts = Math.max(frequency - completedThisWeek, 0);
      console.log('rw',remainingWorkouts);
      res.json({
        goal_streak,
        remainingWorkouts,
      });
  
    } catch (error) {
      console.error('Error fetching streak info:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });