import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importing Link and useNavigate from react-router-dom
import './Page_Style/SignUpPage.css'; // Importing CSS file for styling

const SignUp = () => {
  const navigate = useNavigate(); // Initializing navigate function from react-router-dom
  const [username, setUsername] = useState(''); // State for username input field
  const [password, setPassword] = useState(''); // State for password input field
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password input field
  const [error, setError] = useState(''); // State for error messages

  const handleSignUp = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Reset error state
    setError('');

    // Basic validation
    if (username.length < 3) { // Check if username is at least 3 characters long
      setError('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 6) { // Check if password is at least 6 characters long
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) { // Check if password and confirm password match
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

    // Redirect to login page after successful signup
    alert('Sign up successful. Please login.');
    navigate('/'); // Navigating back to the login page
  };

  return (
    <section className="signUpPage">
      <aside>
        <h1>Sign Up:</h1>
        <h2>Please enter your details:</h2>
        {error && <p className="error">{error}</p>} {/* Display error message if there is an error */}
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state on change
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state on change
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Re-enter Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state on change
            className="input"
            required
          />
          <button type="submit" className="button">Sign Up</button> {/* Submit button for signing up */}
        </form>
        <p>Already Registered? <Link className="link" to="/">Login</Link></p> {/* Link to navigate to login page */}
      </aside>
    </section>
  );
};

export default SignUp;
