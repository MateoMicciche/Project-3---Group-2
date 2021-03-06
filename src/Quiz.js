import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSpring, animated } from 'react-spring';
import { Results } from './Results';
import { socket } from './Socket';
import Chat from './Chat';

// These two lines load environmental variables from .env
const dotenv = require('dotenv');

dotenv.config();

export function Quiz(props) {
  // Sets up states and props
  const [chatMessages, setMessages] = useState([]);
  const [players, setPlayers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  let correctQuestions = 0;
  const [answerStats, setAnswerStats] = useState(new Array(10).fill('Incorrect'));
  const [showChat, setChat] = useState(false);
  const springprops = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
  });

  const {
    game,
    userData,
    isLogged,
    displayChatIcon,
    userName,
    room,
  } = props;
  const { email } = userData;

  // Emits the leave event if a user refreshes/close the application
  window.onbeforeunload = () => {
    socket.emit('leave', { email, room });
  };

  // Function created to help delay the actions of codes
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Function that handles the clicking of an answer choice
  // This function diables all buttons once an answer is chosen
  // and displays the correct answer choice in light green
  // The transition is slow, so the user can see the answer
  // The buttons are then enabled again for the next question
  const handleAnswerChoiceClick = (answer) => {
    let i;
    for (i = 0; i < game.questions[currentQuestion].choices.length; i += 1) {
      document.getElementsByClassName('button')[i].disabled = true;
    }

    const newAnswerStats = answerStats;
    const a = game.questions[currentQuestion].correct_answer;

    const index = game.questions[currentQuestion].choices.indexOf(a);
    const color = document.body.style.backgroundColor;
    document.getElementsByClassName('button')[index].style.backgroundColor = '#00FF00';

    if (answer === game.questions[currentQuestion].correct_answer) {
      newAnswerStats[currentQuestion] = 'Correct';
    }

    sleep(2000).then(() => { setAnswerStats(newAnswerStats); });
    sleep(2000).then(() => { setCurrentQuestion(currentQuestion + 1); });

    if (currentQuestion >= 9) {
      sleep(1200).then(() => {
        for (i = 0; i < game.questions[currentQuestion].choices.length; i += 1) {
          document.getElementsByClassName('button')[i].disabled = false;
          document.getElementsByClassName('button')[i].style.backgroundColor = color;
        }
      });
      sleep(1500).then(() => {
        setAnswerStats(newAnswerStats);
        setCurrentQuestion(currentQuestion + 1);
        for (i = 0; i < 10; i += 1) {
          if (newAnswerStats[i] === 'Correct') {
            correctQuestions += 1;
          }
        }
        socket.emit('leaderboard', { username: userData.name, correctQuestions, room });
        socket.emit('gameOver');
      });
    } else {
      sleep(1200).then(() => {
        for (i = 0; i < game.questions[currentQuestion].choices.length; i += 1) {
          document.getElementsByClassName('button')[i].disabled = false;
          document.getElementsByClassName('button')[i].style.backgroundColor = color;
        }
      });
    }
  };

  // Function that handles the toggling of chat
  // Clicking it will show/hide chat
  const onToggleChat = () => {
    setChat(!showChat);
  };

  // Effect that emits the effect of the message_logged socket event
  useEffect(() => {
    socket.on('message_logged', (data) => {
      setMessages(data.chat);
      setPlayers(data.usernames);
    });
  });

  // This displays all the questions and answer choices for the game
  // The questions display one at a time
  // Once finished the results are shown to the user
  return (
    <div>
      {currentQuestion < 10 ? (
        <animated.div style={springprops}>
          <div className="display">
            <div className="main">
              <div className="question_number">
                <span>
                  Question
                  {' '}
                  {' '}
                  {currentQuestion + 1}
                </span>
                /
                {10}
              </div>
              <div className="question_text">
                {game.questions[currentQuestion].question.replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"')
                  .replace(/&#039;/g, "'")
                  .replace(/&ldquo;/g, '"')
                  .replace(/&rdquo;/g, '"')}
              </div>
              <div className="answer_choices">
                {game.questions[currentQuestion].choices.map((answerChoice) => (
                  <button type="button" className="button" onClick={() => handleAnswerChoiceClick(answerChoice)}>
                    {answerChoice.replace(/&amp;/g, '&')
                      .replace(/&lt;/g, '<')
                      .replace(/&gt;/g, '>')
                      .replace(/&quot;/g, '"')
                      .replace(/&#039;/g, "'")
                      .replace(/&ldquo;/g, '"')
                      .replace(/&rdquo;/g, '"')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </animated.div>
      ) : (
        <Results
          answerStats={answerStats}
          userData={userData}
          isLogged={isLogged}
          room={room}
        />
      )}
      <div className="chat">

        { displayChatIcon ? (
          <div>
            <button type="button" className="settings" onClick={onToggleChat}>
              {' '}
              <i className="fa fa-commenting-o">{' '}</i>
            </button>

            <div>
              {showChat ? (
                <Chat
                  chatMessages={chatMessages}
                  players={players}
                  userName={userName}
                  room={room}
                />
              ) : (
                <button type="button" className="settings" onClick={onToggleChat}>
                  {' '}
                  <i className="fa fa-commenting-o">{' '}</i>
                </button>
              )}
            </div>
          </div>
        ) : <div />}
      </div>
    </div>
  );
}

Quiz.propTypes = {
  game: PropTypes.objectOf.isRequired,
  userData: PropTypes.objectOf.isRequired,
  isLogged: PropTypes.func.isRequired,
  displayChatIcon: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired,
};

export default Quiz;
