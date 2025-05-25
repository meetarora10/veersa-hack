import React, { useState } from 'react';
import { useAppMessage, useDaily } from '@daily-co/daily-react';

const ChatBox = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const callObject = useDaily();

  useAppMessage((msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  const sendMessage = () => {
    if (input.trim()) {
      callObject.sendAppMessage({ text: input }, '*');
      setMessages((prev) => [...prev, { data: { text: input }, fromId: 'me' }]);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-64 border rounded p-2 bg-white mb-2">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, i) => (
          <div key={i} className="text-sm mb-1">
            <b>{msg.fromId}:</b> {msg.data.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
