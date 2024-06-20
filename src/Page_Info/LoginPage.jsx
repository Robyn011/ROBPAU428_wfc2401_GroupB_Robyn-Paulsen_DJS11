import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Page_Style/LoginPage.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // Fetch credentials from local storage or your authentication API
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    // Check if the entered username and password match the stored credentials
    if (username === storedUsername && password === storedPassword) {
      // Show loading indicator
      setLoading(true);

      // Simulate a loading delay of 5 seconds before navigating to '/home'
      setTimeout(() => {
        setLoading(false);
        navigate('/home');
      }, 5000);
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <section className="loginPage">
      <aside>
        <h1>Login</h1>
        <h2>Please enter your details:</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            disabled={loading}
          />
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
        {loading && <p className="loading">Loading...</p>}
        <p>Not Yet Registered? <Link className="link" to="/signup">Sign Up</Link></p>
      </aside>
    </section>
  );
};

export default Login;
