import React, { useContext } from "react";
import "./NavBar.css";
import { NavLink, Link } from "react-router-dom";
import UserContext from "../auth/UserContext";
import logo from "../codeIcon.png";

function NavBar({logout}) {
  const { currUser } = useContext(UserContext);

  const loggedInNav = () => {
    return (
      <div className="navbar">
        <div className="navbar-brand">
          <NavLink exact to="/">
            QReator
          </NavLink>
          <img src={logo} 
              alt="logo" 
              style={{width: '20px',
                      height: '20px', 
                      backgroundColor: 'white',
                      marginLeft: '8px'}}></img>
        </div>
  
        <div className="navbar-links">
          <NavLink exact to="/codes">My QR Codes</NavLink>
          <NavLink exact to="/create">Create QR</NavLink>
          <NavLink exact to="/profile">Profile</NavLink>
          <Link to="/" onClick={logout}>Log Out</Link> 
          
        </div>
      </div>
    );
  }

  const loggedOutNav = () => {
    return (
      <div className="navbar">
        <div className="navbar-brand">
          <NavLink exact to="/">
            QReator
          </NavLink>
          <img src={logo} 
              alt="logo" 
              style={{width: '20px',
                      height: '20px', 
                      backgroundColor: 'white',
                      marginLeft: '8px'}}></img>
        </div>  
        <div className="navbar-links">          
          <NavLink to="/signup">Sign Up</NavLink>  
          <NavLink to="/login">Log In</NavLink>            
        </div>
      </div>
    );   
  }

  return (
    <div>
      {currUser ? loggedInNav() : loggedOutNav()}
    </div>  
  )

}

export default NavBar;
