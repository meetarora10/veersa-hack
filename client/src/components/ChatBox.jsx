import React, { useState, useEffect, useRef } from "react";
import { FaPaperclip, FaDownload, FaTimes, FaPaperPlane, FaEye } from "react-icons/fa";
import io from "socket.io-client";
import { useDaily } from "@daily-co/daily-react";

function ChatBox({ onClose, userRole }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const daily = useDaily();
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    async function fetchRoomInfo() {
      if (daily && typeof daily.room === "function") {
        const info = await daily.room();
        setRoomInfo(info);
      }
    }
    fetchRoomInfo();
  }, [daily]);

  useEffect(() => {
    if (!roomInfo?.name) return;

    const socket = io(`http://${window.location.hostname}:5000`, {
      transports: ["websocket"],
      path: "/socket.io",
    });

    socket.on("connect", () => {
      console.log("Connected to chat server");
      setIsConnected(true);
      socket.emit("join", { roomId: roomInfo.name });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from chat server");
      setIsConnected(false);
    });

    socket.on("message", (message) => {
      if (message.roomId === roomInfo.name) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("file", (fileMessage) => {
      if (fileMessage.roomId === roomInfo.name) {
        setMessages((prev) => [...prev, fileMessage]);
      }
    });

    socket.on("status", (data) => {
      console.log("Status:", data.msg);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [roomInfo?.name]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !roomInfo?.name) return;

    socket.emit("message", {
      content: newMessage,
      roomId: roomInfo.name,
      sender: userRole || daily.participants().local?.user_name || "Anonymous",
    });

    setNewMessage("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !roomInfo?.name) return;

    setFileUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("roomId", roomInfo.name);

    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const fileData = JSON.parse(xhr.responseText);
          if (socket) {
            socket.emit("file", {
              fileName: fileData.fileName,
              uniqueFileName: fileData.uniqueFileName,
              fileUrl: fileData.fileUrl,
              roomId: roomInfo.name,
              sender: userRole || daily.participants().local?.user_name || "Anonymous",
            });
          }
        } else {
          console.error("File upload failed:", xhr.statusText);
        }
        setFileUploading(false);
        setUploadProgress(0);
      };

      xhr.onerror = () => {
        console.error("File upload error:", xhr.statusText);
        setFileUploading(false);
        setUploadProgress(0);
      };

      xhr.open("POST", "http://localhost:5000/api/files/upload");
      xhr.send(formData);
    } catch (error) {
      console.error("File upload error:", error);
      setFileUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('File download error:', error);
    }
  };

  const handlePreview = async (fileUrl, fileName) => {
    try {
      const previewUrl = `${fileUrl}?preview=true`;
      const response = await fetch(previewUrl);
      if (!response.ok) throw new Error('Preview failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPreviewFile({ url, fileName });
    } catch (error) {
      console.error('File preview error:', error);
    }
  };

  const closePreview = () => {
    if (previewFile?.url) {
      window.URL.revokeObjectURL(previewFile.url);
    }
    setPreviewFile(null);
  };

  if (!roomInfo?.name) {
    return null;
  }

  return (
    <div
      ref={chatBoxRef}
      className="flex flex-col h-full bg-card dark:bg-dark-card rounded-lg border border-border dark:border-dark-border shadow-lg"
    >
      <div className="p-3 border-b border-border dark:border-dark-border flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground">
          Room Chat
        </h3>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <button
            onClick={onClose}
            className="text-accent dark:text-dark-accent hover:text-foreground dark:hover:text-dark-foreground"
          >
            <FaTimes />
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start space-x-2">
            <div className="flex-1 bg-secondary dark:bg-dark-secondary p-3 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-medium text-primary">
                  {message.sender || "Anonymous"}
                </span>
                <span className="text-xs text-accent dark:text-dark-accent">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              {message.type === "file" ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePreview(message.fileUrl, message.fileName)}
                    className="text-foreground dark:text-dark-foreground hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-1"
                  >
                    <span>{message.fileName}</span>
                    <FaEye className="text-sm" />
                  </button>
                  <button
                    onClick={() => handleDownload(message.fileUrl, message.fileName)}
                    className="text-primary hover:text-primary-dark"
                    title="Download file"
                  >
                    <FaDownload />
                  </button>
                </div>
              ) : (
                <p className="text-foreground dark:text-dark-foreground">
                  {message.content}
                </p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-2 border-t border-border dark:border-dark-border bg-white dark:bg-dark-secondary"
      >
        <div className="flex flex-col space-y-2">
          {fileUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          <div className="flex space-x-2 items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-2 py-1 rounded-lg border bg-gray-50 dark:bg-dark-secondary text-gray-900 dark:text-dark-foreground text-sm"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={fileUploading}
              className="px-2 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              title="Attach file"
            >
              <FaPaperclip />
            </button>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-2 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              title="Send"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </form>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-card rounded-lg p-4 max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground">
                {previewFile.fileName}
              </h3>
              <button
                onClick={closePreview}
                className="text-accent dark:text-dark-accent hover:text-foreground dark:hover:text-dark-foreground"
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              {previewFile.fileName.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.fileName}
                  className="max-w-full h-auto object-contain"
                />
              ) : previewFile.fileName.match(/\.(pdf)$/i) ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-[70vh] border-0"
                  title={previewFile.fileName}
                />
              ) : (
                <div className="p-4 text-center">
                  <p className="text-foreground dark:text-dark-foreground">
                    Preview not available for this file type
                  </p>
                  <button
                    onClick={() => handleDownload(previewFile.url, previewFile.fileName)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Download File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
