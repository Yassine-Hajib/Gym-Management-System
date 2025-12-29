import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../Style/SignupLogin.css'; 
import axios from 'axios';

const Signup = () => {  
  const navigate = useNavigate();

  const { role: urlRole } = useParams(); // récuperation les paramètres de l’URL
  const role = urlRole ? urlRole.toLowerCase() : 'member'; // si role n'exsit pas par defaut Membre
  const isOwner = role === 'owner';
  
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ 
    name: '', phone: '', dob: '', gymName: '', email: '', password: '',
  });

  const handleChange = (e) => {  // Met a jour des champs modifier 
    const { name, value } = e.target; 
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setError('');
  };

  
  

const handleSignup = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/signup', {
      ...formData,
      role: role // Sending the role from the URL parameter
    });

    alert("Success! Account created in the database.");
    navigate(`/login/${role}`);
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong");
  }
};


  const title = `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)}`;

  return (
    <div className="form-container-wrapper">
      <div className="form-box">
        <h2 className="form-title">{title}</h2>
        
        {error && <p className="error-message">🚨 {error}</p>}

        <form onSubmit={handleSignup} className="auth-form">
          
          <div className="input-group"><label htmlFor="name">Name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required/></div>
          <div className="input-group"><label htmlFor="phone">Phone</label><input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required/></div>
          <div className="input-group"><label htmlFor="dob">Date of Birth</label><input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required/></div>

          {isOwner && (
            <div className="input-group"><label htmlFor="gymName">Gym Name</label><input type="text" id="gymName" name="gymName" value={formData.gymName} onChange={handleChange} required/></div>
          )}

          <div className="input-group"><label htmlFor="email">Email</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required/></div>
          <div className="input-group"><label htmlFor="password">Password</label><input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required/></div>

          <button type="submit" className="submit-btn"> Sign up </button>
        </form>

        <p className="toggle-text">
          Already have an account?
          <Link to={`/login/${role}`} className="toggle-link"> Log In</Link>
        </p>
        
        <p className="role-change-text">
          <Link to="/" className="toggle-link">&larr; Go back to choose role</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;