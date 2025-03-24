## How to Run the Project

Follow these steps to clone and run this project on your local machine.

### Step 1: Clone or Download the project

First, clone or download this project to your local machine.


   https://github.com/harisbashir1/fitbuddy.git

   git@github.com:harisbashir1/fitbuddy.git


### Step 2: Set Up the Backend (Express & MySQL)
### -Make sure MySQL service is running before proceeding. You can use XAMPP, MAMP, or MySQL Workbench to start the MySQL service.
### Note: The trigger creation queries were tested with XAMPP and phpMyAdmin,

1. **Navigate to the `backend` directory**:

   ```bash
   cd backend
   ```

2. **Install the backend dependencies**:

   ```bash
   npm install
   ```

3. **Create the MySQL Database and Table**:

   - Start your MySQL service (using XAMPP, MAMP, or MySQL Workbench).
   - Open a MySQL client (like MySQL Workbench or the command line) and run the following SQL commands to create the database and tables:

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
)

ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `username` (`username`);



CREATE TABLE friendships (
    friendship_id INT AUTO_INCREMENT PRIMARY KEY,
    userID1 INT NOT NULL,
    userID2 INT NOT NULL,
    
    -- Foreign key constraints
    CONSTRAINT fk_user1 FOREIGN KEY (userID1) REFERENCES users(userID) ON DELETE CASCADE,
    CONSTRAINT fk_user2 FOREIGN KEY (userID2) REFERENCES users(userID) ON DELETE CASCADE,
    
 	smaller_userID INT GENERATED ALWAYS AS (LEAST(userID1, userID2)) STORED,
    larger_userID INT GENERATED ALWAYS AS (GREATEST(userID1, userID2)) STORED,
    -- Ensure no duplicate friendships
    UNIQUE KEY (smaller_userID, larger_userID)
);

CREATE TABLE friend_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    
    -- Foreign key constraints
    CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES users(userID) ON DELETE CASCADE,
    CONSTRAINT fk_receiver FOREIGN KEY (receiver_id) REFERENCES users(userID) ON DELETE CASCADE,
    
    -- Ensure no duplicate requests
    UNIQUE KEY (sender_id, receiver_id)
);

4. **Start the backend server (ensuring you are still in backend directory)**:

   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5050`.

### Step 3: Set Up the Frontend (React)

1. **In another terminal Navigate to the `fitbuddy-app` directory**:

2. **Install the frontend dependencies**:

   ```bash
   npm install
   ```

3. **Start the frontend server**:

   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

### Step 4: Usage

1. **Access the Web Application**:

   Open your browser and go to `http://localhost:5173`. This will load the homepage of the application.