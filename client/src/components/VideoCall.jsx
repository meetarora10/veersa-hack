import React, { useEffect, useRef } from 'react';
import DailyIframe from '@daily-co/daily-js';

const VideoCall = ({ roomUrl }) => {
  const callFrameRef = useRef(null);

  useEffect(() => {
    if (!roomUrl) return;

    const callFrame = DailyIframe.createFrame({
      showLeaveButton: true,
      iframeStyle: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        border: '0',
      },
    });

    callFrame.join({ url: roomUrl });
    callFrameRef.current = callFrame;

    return () => {
      callFrame.leave();
    };
  }, [roomUrl]);

  return <div id="video-call-container" />;
};

export default VideoCall;
