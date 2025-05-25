import React from 'react';

const Transcription = ({ transcription }) => (
  <div className="flex-1 overflow-y-auto">
    <h2 className="text-lg font-semibold mb-2">Live Transcription</h2>
    <div className="bg-white p-4 rounded-lg shadow">
      <pre className="whitespace-pre-wrap text-sm">
        {transcription || 'Waiting for transcription...'}
      </pre>
    </div>
  </div>
);

export default Transcription;