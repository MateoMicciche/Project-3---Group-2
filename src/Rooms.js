import './Leaderboard.css';
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import PropTypes from 'prop-types';
import GameMode from './GameMode';
import { socket } from './Socket';

export function Rooms(props) {
  const [roomName, setRoom] = useState(null);
  const [playerType, setPlayerType] = useState('');
  const { userData, isLogged } = props;
  const { name, img, email } = userData;
  const springprops = useSpring({
    from: { opacity: 0, marginTop: -50 },
    to: { opacity: 1, marginTop: 0 },
    delay: 400,
  });
  console.log(`THIS IS THE EMAIL IN ROOMS.JS COMPONENT : ${email}`);

  const roomHandler = (room) => {
    console.log(room);
    socket.emit('join', room);
    const url = '/api/v1/join';
    const data = JSON.stringify({
      email,
      img,
      name,
      room,
    });
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        console.log(responseData.playerType);
        if (responseData.status === 200) {
          setPlayerType(responseData.playerType);
        }
      });
    setRoom(room);
  };

  useEffect(() => {
    socket.on('updated_host', (hostEmail) => {
      console.log(`hostEmail: ${hostEmail}`);
      console.log(`email: ${email}`);
      console.log(`name: ${name}`);
      console.log(`img: ${img}`);
      if (hostEmail === email) {
        console.log('YOU ARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRE HOSTYYYYYYYYYYYYYYYYYYYYYYYYYY');
        setPlayerType('host');
      }
    });
  }, []);

  return (
    <animated.div style={springprops}>
      <div>
        { roomName ? (
          <div>
            <GameMode
              userData={userData}
              isLogged={isLogged}
              playerType={playerType}
              room={roomName}
            />
          </div>
        ) : (
          <div>
            <button type="button" onClick={() => roomHandler('one')}>ONE</button>
            <button type="button" onClick={() => roomHandler('two')}>TWO</button>
            <button type="button" onClick={() => roomHandler('three')}>THREE</button>
          </div>
        )}
      </div>
    </animated.div>
  );
}

Rooms.propTypes = {
  userData: PropTypes.arrayOf.isRequired,
  isLogged: PropTypes.func.isRequired,
};

export default Rooms;
