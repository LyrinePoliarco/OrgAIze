import React, { useState } from "react";
import "./ChatBubble.css"; // Optional CSS styling

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Floating Chat Button */}
      <div className="chat-button" onClick={toggleChat}>
        💬
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">ChatBot</div>
          <div className="chat-body">
            <p>Hello! How can I help you today?</p>
          </div>
          <div className="chat-footer">
            <input type="text" placeholder="Type your message..." />
          </div>
        </div>
      )}
    </div>
  );
};

if (document.getElementById('root')) {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ChatBubble />
    </React.StrictMode>
  );
}


export default ChatBubble;
