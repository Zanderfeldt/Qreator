import React, { useContext } from "react";
import "./Home.css";
import UserContext from "./auth/UserContext";
import { Link } from "react-router-dom";
import logo from "./codeIcon.png";

function Home() {
  const { currUser } = useContext(UserContext);

  return (
    <div className="Home">
      <img src={logo} alt="logo" style={{width: "150px"}}></img>
      <h1>QReator</h1>
      <p>Design your own QR Codes in one, convenient place.</p>
      { currUser ?
      <div> 
      <h2>
        Welcome Back, {currUser.firstName || currUser.username}! 
      </h2>
      <div className="Home-buttons">
      <Link to="/create" className="Home-buttons signup">Start Qreating</Link>
      </div>
      </div>
      : (<div className="Home-buttons">
      <Link to="/signup" className="Home-buttons signup">Sign Up</Link>
      <Link to="/login" className="Home-buttons login">Log In</Link>
    </div>
    )}
      
    </div>
  )

}

export default Home;