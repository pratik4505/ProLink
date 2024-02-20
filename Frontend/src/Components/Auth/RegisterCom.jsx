import React,{useState} from "react"
import { useNavigate } from "react-router-dom";


import '../../sass/styling.scss';
import { AiOutlineUser } from 'react-icons/ai';
import {BsKey} from 'react-icons/bs';
const baseUrl = import.meta.env.VITE_SERVER_URL;
export default function RegisterComponent() {
  const navigate = useNavigate();
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleSignUp = async () => {
    setLoading(true);
    try {
      
      const response = await fetch(`${baseUrl}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, email, password }),
      });

      if (response.ok) {
        
        navigate('/Login');
      } else {
       
        const data = await response.json();
        setResponseMessage(data.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setResponseMessage('An error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h1>Register</h1>
        <img className="login-lync-wo-back" src="/Lyncwoback.png" alt="Lync" />
        <div className="input-group">
          <div className="input-field">
            <AiOutlineUser className="react-icons" />
            <input
            type="text"
            name="username"
            value={userName}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          </div>
          <div className="input-field">
            <AiOutlineUser className="react-icons" />
            <input
            type="text"
            name="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          </div>
          <div className="input-field">
            <BsKey className="react-icons" />
            <input
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          </div>
          
          <div className="submit-container">
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <div className="submit" onClick={handleSignUp}>
              Sign up
            </div>
          )}
          </div>
          
        </div>
      </div>
      {responseMessage && (
        <div className="error-message">{responseMessage}</div>
      )}
    </div>
  );
}





