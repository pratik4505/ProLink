import React, { useState,useContext } from 'react';
import { useNavigate } from "react-router-dom";


import { AiOutlineUser } from 'react-icons/ai';
import {BsKey} from 'react-icons/bs';
import { Link } from 'react-router-dom';

import GlobalContext from '../../context/GlobalContext';

import '../../sass/styling.scss';



export default function LoginComponent() {
  const gloContext=useContext(GlobalContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  
  const change = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 

  const handleLogin = async () => {
    setLoading(true);
    try {
      
      const response = await  fetch('http://localhost:3000/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      if (response.ok) {
        
          gloContext.initialLoad();
          navigate('/')
        
       
      } else {    
        
        setResponseMessage(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setResponseMessage('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h1>Log in</h1>
        <img className='login-lync-wo-back' src="/Lyncwoback.png" alt="Lync" />
        <div className="input-group">
          <div className="input-field">
            <AiOutlineUser className="react-icons" />
            <input
              type="text"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={change}
            />
          </div>
          <div className="input-field">
            <BsKey className="react-icons" />
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={change}
            />
          </div>
          <p>
            Lost password <a href="#">Click Here!</a>
          </p>
          <div className="submit-container">
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : (
              <div className="submit" onClick={handleLogin}>
                Log in
              </div>
            )}
            
           
          </div>
          <div className="register" >
            Don't have an account? <Link to="/Register">Register</Link>
          </div>
        </div>
      </div>
      {responseMessage && (
        <div className="error-message">{responseMessage}</div>
      )}
    </div>
  );
}
