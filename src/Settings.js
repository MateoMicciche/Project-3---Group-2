import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import PropTypes from 'prop-types';
import { Quiz } from './Quiz';
import { socket } from './Socket';

// These two lines load environmental variables from .env
const dotenv = require('dotenv');

dotenv.config();

// Holds the base url of the REST API URL
const BASE_URL = '/api/v1/new';

function Settings(props) {
  // Sets all states and props
  const [game, setGame] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [category, setCategory] = useState(null);
  const {
    userData,
    isLogged,
    playerType,
    room,
    displayChatIcon,
    userName,
  } = props;

  const { email } = userData;

  const springprops = useSpring({
    from: { opacity: 0, marginTop: -50 },
    to: { opacity: 1, marginTop: 0 },
    delay: 400,
  });

  // Emits the leave event if a user refreshes/close the application
  window.onbeforeunload = () => {
    socket.emit('leave', { email, room });
  };

  // Sets the category of the game to the one specified by the user
  const categoryHandler = (event) => {
    setCategory(event.target.value);
  };

  // Sets the difficulty of the game to the one specified by the user
  const difficultyHandler = (event) => {
    setDifficulty(event.target.value);
  };

  // Function that handles the settings chosen for the game
  const handleSettings = () => {
    const data = JSON.stringify({
      difficulty,
      category,
      color: 'default',
      room,
      // 'mode': 'single'
    });
    fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
      .then((response) => response.json());
  };

  // Effect that sets the game according to the settings
  useEffect(() => {
    socket.on('startGame', (data) => {
      setGame(data.settings);
    });
  }, []);

  // Displays the settings for the game
  // Here the user can set up their game and start once they're ready
  return (
    <animated.div style={springprops}>
      <div>
        {game ? (
          <Quiz
            game={game}
            userData={userData}
            isLogged={isLogged}
            displayChatIcon={displayChatIcon}
            userName={userName}
            room={room}
          />
        ) : (
          playerType === 'host' ? (
            <div className="display">
              <div className="main">
                <label htmlFor="trivia_difficulty">Choose a Category:</label>
                <select
                  onChange={difficultyHandler}
                  name="trivia_difficulty"
                  data-testid="difficulty"
                >
                  <option value="any">Any Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                <label htmlFor="trivia_category">Choose a Category:</label>

                <select onChange={categoryHandler} name="trivia_category" data-testid="category">
                  <option value="any">Any Category</option>
                  <option value="9">General Knowledge</option>
                  <option value="10">Entertainment: Books</option>
                  <option value="11">Entertainment: Film</option>
                  <option value="12">Entertainment: Music</option>
                  <option value="13">Entertainment: Musicals &amp; Theatres</option>
                  <option value="14">Entertainment: Television</option>
                  <option value="15">Entertainment: Video Games</option>
                  <option value="16">Entertainment: Board Games</option>
                  <option value="17">Science &amp; Nature</option>
                  <option value="18">Science: Computers</option>
                  <option value="19">Science: Mathematics</option>
                  <option value="20">Mythology</option>
                  <option value="21">Sports</option>
                  <option value="22">Geography</option>
                  <option value="23">History</option>
                  <option value="24">Politics</option>
                  <option value="25">Art</option>
                  <option value="26">Celebrities</option>
                  <option value="27">Animals</option>
                  <option value="28">Vehicles</option>
                  <option value="29">Entertainment: Comics</option>
                  <option value="30">Science: Gadgets</option>
                  <option value="31">Entertainment: Japanese Anime &amp; Manga</option>
                  <option value="32">Entertainment: Cartoon &amp; Animations</option>
                </select>

                <button type="button" className="button" onClick={handleSettings}>
                  Play Game
                </button>
              </div>
            </div>
          ) : (
            <div>Host is selecting game settings...</div>
          )
        )}
      </div>
    </animated.div>
  );
}

Settings.propTypes = {
  userData: PropTypes.objectOf.isRequired,
  isLogged: PropTypes.func.isRequired,
  playerType: PropTypes.string.isRequired,
  displayChatIcon: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired,
};

export default Settings;
