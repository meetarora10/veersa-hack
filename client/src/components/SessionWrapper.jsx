import React, { useEffect, useRef, useState } from "react";
import { DailyProvider } from "@daily-co/daily-react";
import DailyIframe from "@daily-co/daily-js";
import ChatBox from "./ChatBox";
import Transcription from "./Transcription";

// Separate component for the video call content
const VideoCallContent = ({ roomUrl, userRole }) => {
  const containerRef = useRef(null);
  const callFrameRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [transcript, setTranscript] = useState("");
  const transcriptionStartedRef = useRef(null);

  const startTranscription = async (roomName) => {
     if (transcriptionStartedRef.current === roomName) {
      return;
    }
    transcriptionStartedRef.current = roomName;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/transcription/start/${roomName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to start transcription");
      }

      const data = await response.json();
      console.log("Transcription started:", data);
    } catch (err) {
      console.error("Failed to start transcription:", err);
    }
  };

  useEffect(() => {
    if (!roomUrl) {
      setError("No room URL provided.");
      setLoading(false);
      return;
    }

    const initializeCall = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create the call frame
        callFrameRef.current = DailyIframe.createFrame(containerRef.current, {
          showLeaveButton: true,
          showLocalVideo: true,
          showParticipantsBar: true,
          showUserNameChangeUI: true,
          iframeStyle: {
            position: "relative",
            width: "100%",
            height: "100%",
            border: "0",
          },
        });

        // Listen for transcription events
        callFrameRef.current.on("transcription-message", (ev) => {
          console.log("Transcription event:", ev);

          const spokenText = ev.text;
          const timestamp = new Date(ev.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          // Defensive participant name lookup
          let name = userRole.charAt(0).toUpperCase() + userRole.slice(1);
          //   if (
          //     callFrameRef.current &&
          //     typeof callFrameRef.current.participants === 'function'
          //   ) {
          //     const participants = callFrameRef.current.participants();
          //       console.log(participants);
          //       console.log(participants[ev.participantId]);
          //     if (participants && participants[ev.participantId]) {
          //       name = participants[ev.participantId].user_name || ev.participantId;
          //     }
          //   }

          if (spokenText) {
            const formattedLine = `[${timestamp}] ${name}: ${spokenText}`;
            setTranscript((prev) => prev + `\n${formattedLine}`);
          }
        });

        // Add event listeners
        callFrameRef.current.on("joined-meeting", () => {
          setIsJoined(true);
          setLoading(false);
          // Extract room name from URL and start transcription
          const roomName = roomUrl.split("/").pop();
          startTranscription(roomName);
        });

        callFrameRef.current.on("left-meeting", () => {
          setIsJoined(false);
        });

        // Join the call
        await callFrameRef.current.join({ url: roomUrl });
      } catch (err) {
        console.error("Failed to join Daily room:", err);
        setLoading(false);
      }
    };

    initializeCall();

    // Cleanup
    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.destroy();
        callFrameRef.current = null;
      }
    };
  }, [roomUrl]);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`relative ${isJoined ? "w-4/5" : "w-full"}`}>
        {error && <div className="text-red-600 p-4">{error}</div>}
        {loading && !error && (
          <div className="text-gray-600 p-4">Loading Daily meeting...</div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>
      {isJoined && (
        <div className="w-[20vw] min-w-[300px] max-w-[400px] flex flex-col p-3 bg-gray-50 border-l border-gray-200 overflow-y-auto">
          <Transcription transcription={transcript} />
          <div className="mt-4 flex-1 flex flex-col">
            <ChatBox />
          </div>
        </div>
      )}
    </div>
  );
};

// Main wrapper component
const SessionWrapper = ({ roomUrl, userRole }) => {
  return (
    <DailyProvider>
      <VideoCallContent roomUrl={roomUrl} userRole={userRole} />
    </DailyProvider>
  );
};

export default SessionWrapper;
