import './Options.css';
import Login from './Login';
import { GoogleLogout } from 'react-google-login';
import React, { useState, useRef, useEffect } from 'react';

// These two lines load environmental variables from .env
const dotenv = require('dotenv');
dotenv.config();

// Fills clientID variable with API ID key
const clientID = process.env.REACT_APP_GOOGLE_ID;

function Options() {
  
  // Boolean that tracks status on if the user is logged in or not
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  // Code that sets login status to false when button is clicked
  const onSuccess = (res) => {
    setIsLoggedIn(!isLoggedIn);
  };
  
  return (
  <div>
    {isLoggedIn ? (
      <body>
        <h1>
          Welcome Back!<br/><br/>
        </h1>
        <h2 id="teamname">
          nogginy
        </h2>
        <h7>
          <GoogleLogout
            clientId={process.env.REACT_APP_GOOGLE_ID}
            buttonText="Log out"
            onLogoutSuccess={onSuccess}
          ></GoogleLogout>
        </h7>
      </body>
      
      ) : <Login />}
  </div>
  );
}

export default Options;