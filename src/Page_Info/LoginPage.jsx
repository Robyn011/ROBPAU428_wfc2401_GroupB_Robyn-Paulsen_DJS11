import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importing Link and useNavigate from react-router-dom for navigation
import './Page_Style/LoginPage.css'; // Importing CSS file for styling

const Login = () => {
  const navigate = useNavigate(); // Initializing navigate function from react-router-dom for navigation
  const [username, setUsername] = useState(''); // State for storing username input
  const [password, setPassword] = useState(''); // State for storing password input
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Fetch credentials from local storage or your authentication API
    const storedUsername = localStorage.getItem('username'); // Retrieve stored username from local storage
    const storedPassword = localStorage.getItem('password'); // Retrieve stored password from local storage

    // Check if the entered username and password match the stored credentials
    if (username === storedUsername && password === storedPassword) {
      // Show loading indicator
      setLoading(true);

      // Simulate a loading delay of 5 seconds before navigating to '/home'
      setTimeout(() => {
        setLoading(false); // Hide loading indicator after 5 seconds
        navigate('/home'); // Navigate to '/home' after successful login
      }, 5000); // 5000 milliseconds (5 seconds) delay
    } else {
      alert('Invalid username or password'); // Show alert for invalid credentials
    }
  };

  return (
    <section className="loginPage">
      <aside>
        <h1>Login</h1>
        <h2>Please enter your details:</h2>
        <form onSubmit={handleLogin}>
          {/* Username input field */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state on input change
            className="input"
            disabled={loading} // Disable input field when loading
          />
          {/* Password input field */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state on input change
            className="input"
            disabled={loading} // Disable input field when loading
          />
          {/* Login button */}
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Logging In...' : 'Login'} {/* Change button text based on loading state */}
          </button>
        </form>
        {/* Loading indicator */}
        {loading && <p className="loading">Loading...</p>}
        {/* Link to Signup page */}
        <p>Not Yet Registered? <Link className="link" to="/signup">Sign Up</Link></p>
      </aside>
    </section>
  );
};

export default Login;
