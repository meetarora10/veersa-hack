import React, { useState } from 'react';
import axios from 'axios';
import VideoCall from './VideoCall';

const StartCall = () => {
  const [roomUrl, setRoomUrl] = useState(null);

  const startCall = async () => {
    const res = await axios.get('/api/create-room');
    setRoomUrl(res.data.url);
  };

  return (
    <div>
      {!roomUrl ? (
        <button onClick={startCall}>Start Video Call</button>
      ) : (
        <VideoCall roomUrl={roomUrl} />
      )}
    </div>
  );
};

export default StartCall;
