import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Page_Style/LoginPage.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Fetch credentials from local storage
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    // Check if the entered username and password match the stored credentials
    if (username === storedUsername && password === storedPassword) {
      // Navigate to the home page if credentials match
      navigate('/home');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <section className={styles.loginPage}>
      <aside>
        <h1>Login</h1>
        <h2>Please enter your details:</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Login</button>
        </form>
        <p>Not Yet Registered? <Link className={styles.link} to="/signup">Sign Up</Link></p>
      </aside>
    </section>
  );
};

export default Login;
