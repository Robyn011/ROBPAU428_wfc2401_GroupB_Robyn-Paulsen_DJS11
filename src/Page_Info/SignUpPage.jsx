import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Page_Style/SignUpPage.css'; 

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();

    // Reset error state
    setError('');

    // Basic validation
    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Save credentials to localStorage 
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    // Clear input fields
    setUsername('');
    setPassword('');
    setConfirmPassword('');

    // Redirect to login page
    alert('Sign up successful. Please login.');
    navigate('/');
  };

  return (
    <section className="signUpPage">
      <aside>
        <h1>Sign Up:</h1>
        <h2>Please enter your details:</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Re-enter Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
            required
          />
          <button type="submit" className="button">Sign Up</button>
        </form>
        <p>Already Registered? <Link className="link" to="/">Login</Link></p>
      </aside>
    </section>
  );
};

export default SignUp;
