import React, { useEffect, useRef } from 'react';

const Transcription = ({ transcription }) => {
  const transcriptRef = useRef(null);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcription]);

  return (
    <div className="flex-1 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">Live Transcription</h2>
      <div
        ref={transcriptRef}
        className="bg-white p-4 rounded-lg shadow h-100 overflow-y-auto"
      >
        <pre className="whitespace-pre-wrap text-sm">
          {transcription || 'Waiting for transcription...'}
        </pre>
      </div>
    </div>
  );
};

export default Transcription;