const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5050;

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