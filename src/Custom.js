import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { socket } from './Socket';

// These two lines load environmental variables from .env
const dotenv = require('dotenv');

dotenv.config();

// Component for user personalization
function Custom(props) {
  const inputRef = useRef(null);
  const { userData, room } = props;
  const { email } = userData;

  // Emits the leave event if a user refreshes/close the application
  window.onbeforeunload = () => {
    socket.emit('leave', { email, room });
  };

  // Sends the user back to GameMode.js when they click the back button
  const onSuccess = () => {
    props.custom();
  };

  // Function for handling color changes
  const colorChanger = (event) => {
    if (event.target.value === 'Light Blue') {
      document.body.className = 'lightblue';
    } else {
      document.body.className = event.target.value;
    }
  };

  // Function for handling font style changes
  const fontChanger = (event) => {
    if (event.target.value === 'Default') {
      document.body.style.fontFamily = 'Catamaran';
    } else {
      document.body.style.fontFamily = event.target.value;
    }
  };

  // Handles an error if the image cannot load
  function myError() {
    alert('Image could not be loaded.');
    const image = document.getElementsByClassName('Picture')[0];
    image.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/200px-Question_mark_%28black%29.svg.png';
  }

  // Handles the clicking of the change button next to the input bar
  // Also handles the errors of the url, ensuring all errors with the url are handled
  // Changes the profile image for the user
  const handleClick = () => {
    document.getElementsByClassName('Picture')[0].onerror = function myErrorFunction() { myError(); };
    const url = inputRef.current.value;
    if (url !== '' && url.length > 4 && url.length < 256) {
      const ending = url.substring(url.length - 3);
      if (ending === 'gif' || ending === 'jpg' || ending === 'png') {
        socket.emit('image_change', [url, userData.email, room]);
        userData.img = url;
        const image = document.getElementsByClassName('Picture')[0];
        image.src = url;
      } else {
        alert('URL is not valid. Must be of type specified and needs to be less than 255 characters.');
      }
    } else {
      alert('Input not long enough to be valid');
    }
  };

  // Diplays all the options and input for user to personalize their game
  return (
    <div>
      <button type="button" className="settings exit" onClick={onSuccess}>
        {' '}
        <i className="fas fa-arrow-circle-left">{' '}</i>
      </button>
      <div>
        Select Color:
        {' '}
        {' '}
        <select onChange={colorChanger} name="trivia_category">
          <option selected="selected">Choose</option>
          <option value="Light Blue">Light Blue</option>
          <option value="red">Red</option>
          <option value="mint">Green</option>
          <option value="orange">Orange</option>
          <option value="purple">Purple</option>
          <option value="indigo">Indigo</option>
          <option value="pink">Pink</option>
          <option value="yellow">Yellow</option>
          <option value="blue">Blue</option>
        </select>

        <br />
        <br />
        Select Font:
        {' '}
        {' '}
        <select onChange={fontChanger} name="trivia_category">
          <option selected="selected">Choose</option>
          <option value="Default">Default</option>
          <option value="serif">Serif</option>
          <option value="sans-serif">Sans-Serif</option>
          <option value="monospace">Monospace</option>
          <option value="cursive">Cursive</option>
          <option value="system-ui">System-ui</option>
        </select>

        <br />
        <br />
        Change Avatar:
        {' '}
        {' '}
        <input ref={inputRef} aria-label="textbox" type="text" />
        {' '}
        {' '}
        <button type="button" onClick={handleClick}> Change </button>
        <br />
        <br />
        (To change your avatar, please copy and paste the url of the image)
        <br />
        *** Image must be of type .png, .jpg, .gif ***
        <br />
        <img src={userData.img} className="Picture" alt="Yo" width="300" height="300" onError="myFunction()" />
      </div>
    </div>
  );
}

Custom.propTypes = {
  custom: PropTypes.objectOf.isRequired,
  userData: PropTypes.objectOf.isRequired,
  room: PropTypes.string.isRequired,
};

export default Custom;
