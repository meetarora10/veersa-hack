import React, { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';
import ChatBox from './ChatBox';
import Transcription from './Transcription';

const PrebuiltCall = ({ roomUrl }) => {
  const containerRef = useRef(null);
  const callFrameRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomUrl) {
      setError('No room URL provided.');
      setLoading(false);
      return;
    }

    const initializeCall = async () => {
      try {
        setLoading(true);
        setError(null);

        
        callFrameRef.current = DailyIframe.createFrame(containerRef.current, {
          showLeaveButton: true,
          showLocalVideo: true,
          showParticipantsBar: true,
          iframeStyle: {
            position: 'relative',
            width: '100%',
            height: '100%',
            border: '0',
          },
        });

        // Event listeners for debugging
        callFrameRef.current.on('joining-meeting', () => {
          console.log('Joining meeting...');
        });

        callFrameRef.current.on('joined-meeting', () => {
          console.log('Joined meeting successfully');
        });

        callFrameRef.current.on('participant-joined', (event) => {
          console.log('Participant joined:', event);
        });

        callFrameRef.current.on('participant-left', (event) => {
          console.log('Participant left:', event);
        });

        callFrameRef.current.on('error', (error) => {
          console.error('Daily.co error:', error);
        });

        await callFrameRef.current.join({ 
          url: roomUrl,
          settings: {
            audio: {
              enabled: true,
              autoGainControl: true,
              echoCancellation: true,
              noiseSuppression: true,
            }
          }
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to join Daily room:', err);
        setError('Failed to join Daily room.');
        setLoading(false);
      }
    };

    initializeCall();

    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.destroy();
        callFrameRef.current = null;
      }
    };
  }, [roomUrl]);

  return (
        <div className="flex h-screen">
      <div className="flex-3 relative w-full">
        {error && (
          <div className="text-red-600 p-4">{error}</div>
        )}
        {loading && !error && (
          <div className="text-gray-700 p-4">Loading Daily meeting...</div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>
      <div className="flex-1 flex flex-col p-4 bg-gray-50 border-l border-gray-200 overflow-y-auto">
        <Transcription />
        <ChatBox />
      </div>
    </div>
  );
};

export default PrebuiltCall;