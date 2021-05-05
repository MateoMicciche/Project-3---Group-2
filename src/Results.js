import './Results.css';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import GameMode from './GameMode';
import Leaderboard from './Leaderboard';
import { socket } from './Socket';
import Login from './Login';

export function Results(props) {
  const {
    answerStats,
    userData,
    isLogged,
    room,
  } = props;

  const { email } = userData;
  const [restart, setRestart] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [scores, setScores] = useState([]);
  const [exit, setExit] = useState(false);
  const [playerType, setPlayerType] = useState('');

  window.onbeforeunload = () => {
    socket.emit('leave', { email, room });
  };

  const replay = () => {
    fetch(`/api/v1/player?email=${email}&room=${room}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json()).then((responseData) => {
        setPlayerType(responseData.player_type);
      });
    setRestart(!restart);
  };

  const exitHandler = () => {
    const data = JSON.stringify({
      email,
      room,
    });
    fetch('/api/v1/leave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
      .then((response) => response.json())
      .then(setExit(!exit));
  };

  useEffect(() => {
    socket.on('leaderboard', (data) => {
      setLeaderboard(data.users);
      setScores(data.scores);
    });
  }, []);
  return (
    <div>
      { restart ? (
        exit ? (
          <Login />
        ) : (
          <div className="stats">
            <Leaderboard leaderboard={leaderboard} scores={scores} />
            <div className="answer_results">
              {answerStats.map((answerChoice, index) => (
                <div>
                  {' '}
                  {index + 1}
                  .
                  {' '}
                  {answerChoice}
                  {' '}
                </div>
              ))}
            </div>
            <button type="button" className="button" onClick={() => replay()}>Replay</button>
            <button type="button" className="button" onClick={exitHandler}>Exit</button>
          </div>
        )
      ) : (<GameMode userData={userData} isLogged={isLogged} playerType={playerType} />
      )}
    </div>
  );
}

Results.propTypes = {
  userData: PropTypes.objectOf.isRequired,
  isLogged: PropTypes.func.isRequired,
  answerStats: PropTypes.arrayOf.isRequired,
  room: PropTypes.string.isRequired,
};

export default Results;
