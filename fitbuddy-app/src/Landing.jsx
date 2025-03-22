import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

const Landing = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');  // Redirect to the dashboard if logged in
    }
  }, [navigate]);
  
    return (
      <div>
        <h1>Fitbuddy</h1>
        <h2>Landing Page</h2>
        <h3>Here we can include pictures and descriptions of Fitbuddy it serves as the initial route to login and registration as well.</h3>
        <Link to="/login">Login</Link>
        <br></br>
        <Link to="/register">Register</Link>
      </div>
    );
    };
    
    export default Landing;