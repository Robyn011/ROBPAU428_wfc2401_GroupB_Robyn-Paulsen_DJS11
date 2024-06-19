import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Page_Style/LoginPage.module.css'; // Ensure this path is correct

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Save credentials to localStorage
    localStorage.setItem('username:', username);
    localStorage.setItem('password:', password);

    // Optionally, you can clear the input fields after successful sign-up
    setUsername('');
    setPassword('');
    setConfirmPassword('');

    // Redirect to login page
    alert('Sign up successful. Please login.');
    navigate('/');
  };

  return (
    <section className={styles.signUpPage}>
      <aside>
        <h1>Sign Up:</h1>
        <h2>Please enter your details:</h2>
        <form onSubmit={handleSignUp}>
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
          <input
            type="password"
            placeholder="Re-enter Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Sign Up</button>
        </form>
        <p>Already Registered? <Link className={styles.link} to="/">Login</Link></p>
      </aside>
    </section>
  );
};

export default SignUp;