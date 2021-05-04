import './Login.css';
import React, { useState, useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import { useSpring, animated } from 'react-spring';
import { socket } from './Socket';
import { Rooms } from './Rooms';

// These two lines load environmental variables from .env
const dotenv = require('dotenv');

dotenv.config();

// const BASE_URL = '/api/v1/new';

// Component that handles Login
function Login() {
  // Boolean that tracks status on if the user is logged in or not
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userData, setUserData] = useState({ name: '', img: '', email: '' });

  const springprops = useSpring({
    from: { opacity: 0, marginTop: -50 },
    to: { opacity: 1, marginTop: 0 },
    delay: 400,
  });

  const isLogged = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  // If the user logs in, the below code executes
  const onSuccess = (res) => {
    /* eslint-disable no-console */
    console.log('[Login Success]');
    const data = res.profileObj;
    const { email } = data;
    const { name } = data;
    const { imageUrl } = data;
    console.log(`THISSSSSSSSSSSSSSSSSS IS YOUR EMAIL ${email}`);
    isLogged();
    setUserData({ name, img: imageUrl, email });
    const loginData = JSON.stringify({
      email,
      name,
      imageUrl,
    });

    const url = '/api/v1/login';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: loginData,
    }).then((response) => response.json());
  };

  // If the user fails to login, the below code executes
  const onFailure = () => {
    console.log('[Login Failed]');
  };

  useEffect(() => {
    socket.on('updateUser', (data) => {
      if (userData.name === data.username) {
        setUserData({ name: data.username, img: data.img, email: data.email });
      }
    });
  });
  /*
  Shows starting page of webapp.
  Once user logs in with their Google Account,
  user will than be taken to the GameMode Component.
  */
  return (
    <animated.div style={springprops}>
      <div>
        {isLoggedIn ? (
          <h1>
            nogginy
            <h2>trivia and chat with friends</h2>
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_ID}
              buttonText="Log in with Google"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy="single_host_origin"
            />
          </h1>
        ) : (
          <Rooms userData={userData} isLogged={isLogged} />
        )}
      </div>
    </animated.div>

  );
}

export default Login;
