import React, { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { API } from "../../utils/api";
import { FaGoogle } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { BsKey } from "react-icons/bs";
import { Link } from "react-router-dom";

import GlobalContext from "../../context/GlobalContext";

import "../../sass/styling.scss";

const baseUrl = import.meta.env.VITE_SERVER_URL;
export default function LoginComponent() {
  const gloContext = useContext(GlobalContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const change = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const googleLoginHandler = async () => {
    window.open("http://localhost:3000/auth/google", "_self");
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await API.post(`/login`, formData,{
        headers: {
          "Content-Type": "application/json",
        },
      } );

      console.log(response);
      if (response.status===200) {
        localStorage.setItem("userData", JSON.stringify(response.data));
        gloContext.initialLoad();
        // navigate('/')
        return <Navigate to="/" />;
      } else {
        setResponseMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setResponseMessage("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h1>Log in</h1>

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
            <div className="submitG" onClick={googleLoginHandler}>
              Log in with Google
            </div>
          </div>
          <div className="register">
            Don't have an account? <Link to="/Register">Register</Link>
          </div>

          <a href={`${baseUrl}/auth/google`}>
            {" "}
            <FaGoogle /> Sign-in with Google
          </a>
        </div>
      </div>
      {responseMessage && (
        <div className="error-message">{responseMessage}</div>
      )}
    </div>
  );
}
