# fitbuddy

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