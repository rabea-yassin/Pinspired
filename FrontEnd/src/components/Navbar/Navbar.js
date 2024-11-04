import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { Search } from "../Search/Serach"

function Navbar() {

  console.log(sessionStorage.getItem("loggedin"))

  return (
    <div className="Navbar-container">
      {
        sessionStorage.getItem("loggedin") == "true" ?
          <nav className="navbar">
            <div className="brand-title" ><Link to='/Home'>Pinspired</Link></div>
            <Search></Search>
            <a className="toggle-button" onClick={() => {
              const navbarLinks = document.getElementsByClassName('navbar-links')[0];
              navbarLinks.classList.toggle('active')
            }}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </a>
            <div className="navbar-links">
              <ul>
                <li><Link to='/Home'>Home  </Link></li>
                <li><Link to='/Friendspost'>Friendspost  </Link></li>
                <li><Link to='/Upload'>Upload  </Link></li>
                <li><Link to='/profile'>profile  </Link></li>
              </ul>
            </div>
          </nav> :

          <nav className="navbar">
            <div className="brand-title" ><Link to='/Home'>Pinspired</Link></div>

            <a className="toggle-button" onClick={() => {
              const navbarLinks = document.getElementsByClassName('navbar-links')[0];
              navbarLinks.classList.toggle('active')
            }}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </a>
            <div className="navbar-links">
              <ul>
                <li> <Link to='/'>signin/signup </Link></li>
              </ul>
            </div>
          </nav>
      }

    </div>
  );
}

export default Navbar;
