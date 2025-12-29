import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../Style/SignupLogin.css';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const { role: urlRole } = useParams(); 
  const role = urlRole ? urlRole.toLowerCase() : 'member'; 
  
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Send request to Laravel API
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: formData.email,
        password: formData.password,
      });

      const user = response.data.user;
      const token = response.data.token;

      // 2. Role Verification: Check if the database role matches the URL role
      if (user.role.toLowerCase() !== role.toLowerCase()) {
        setError(`Access Denied: You are registered as a ${user.role}, not a ${role}.`);
        return;
      }

      // 3. Success: Store Token/User and Redirect
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      alert(`Login Successful! Welcome back ${user.name}`);

      // Route based on role
      if (user.role === 'owner') navigate('/owner/dashboard');
      else if (user.role === 'coach') navigate('/coach/home');
      else navigate('/member/home');

    } catch (err) {
      // 4. Detailed Error Catching
      if (err.response) {
        // The server responded with a status code (e.g., 401 Unauthorized)
        setError(err.response.data.message || "Invalid email or password");
      } else {
        // Something happened in setting up the request
        setError("Cannot connect to the server. Is Laravel running?");
      }
    }
  };

  const title = `Log In as ${role.charAt(0).toUpperCase() + role.slice(1)}`;

  return (
    <div className="form-container-wrapper">
      <div className="form-box">
        <h2 className="form-title">{title}</h2>
        
        {error && <p className="error-message">🚨 {error}</p>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required
            />
          </div>

          <button type="submit" className="submit-btn"> Login </button>
        </form>

        <p className="toggle-text">
          Don't have an account?
          <Link to={`/signup/${role}`} className="toggle-link"> Sign Up</Link>
        </p>
        
        <p className="role-change-text">
          <Link to="/" className="toggle-link">&larr; Go back to choose role</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;