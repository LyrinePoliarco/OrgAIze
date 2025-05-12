import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Message from "../components/Message";
import PromptForm from "../components/PromptForm";
import Sidebar from "../components/Sidebar";
import LoginPage from "../authentication/LoginPage";
import SignupPage from "../authentication/SignupPage";
import AcssOrgChart from "../dashboards/AcssOrgChart";
import Acss from "../dashboards/Acss";
import AcssStudent from "../dashboards/AcssStudent";

import { Menu } from "lucide-react";

const AppContent = () => {
  // Main app state (chat logic)
  const [isLoading, setIsLoading] = useState(false);
  const typingInterval = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 768);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem("conversations");
      return saved ? JSON.parse(saved) : [{ id: "default", title: "New Chat", messages: [] }];
    } catch {
      return [{ id: "default", title: "New Chat", messages: [] }];
    }
  });
  const [activeConversation, setActiveConversation] = useState(() => {
    return localStorage.getItem("activeConversation") || "default";
  });

  useEffect(() => {
    localStorage.setItem("activeConversation", activeConversation);
  }, [activeConversation]);

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const currentConversation = conversations.find((c) => c.id === activeConversation) || conversations[0];

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({ top: messagesContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, activeConversation]);

  const typingEffect = (text, messageId) => {
    let textElement = document.querySelector(`#${messageId} .text`);
    if (!textElement) return;
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              messages: conv.messages.map((msg) => (msg.id === messageId ? { ...msg, content: "", loading: true } : msg)),
            }
          : conv
      )
    );
    textElement.textContent = "";
    const words = text.split(" ");
    let wordIndex = 0;
    let currentText = "";
    clearInterval(typingInterval.current);
    typingInterval.current = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex === 0 ? "" : " ") + words[wordIndex++];
        textElement.textContent = currentText;
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeConversation
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) => (msg.id === messageId ? { ...msg, content: currentText, loading: true } : msg)),
                }
              : conv
          )
        );
        scrollToBottom();
      } else {
        clearInterval(typingInterval.current);
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeConversation
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) => (msg.id === messageId ? { ...msg, content: currentText, loading: false } : msg)),
                }
              : conv
          )
        );
        setIsLoading(false);
      }
    }, 40);
  };

  const generateResponse = async (conversation, botMessageId) => {
    const formattedMessages = conversation.messages?.map((msg) => ({
      role: msg.role === "bot" ? "model" : msg.role,
      parts: [{ text: msg.content }],
    }));
    try {
      const res = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: formattedMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error.message);
      const responseText = data.candidates[0].content.parts[0].text.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
      typingEffect(responseText, botMessageId);
    } catch (error) {
      setIsLoading(false);
      updateBotMessage(botMessageId, error.message, true);
    }
  };

  const updateBotMessage = (botId, content, isError = false) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              messages: conv.messages.map((msg) => (msg.id === botId ? { ...msg, content, loading: false, error: isError } : msg)),
            }
          : conv
      )
    );
  };

  return (
    <div className={`app-container ${theme === "light" ? "light-theme" : "dark-theme"}`}>
      <div className={`overlay ${isSidebarOpen ? "show" : "hide"}`} onClick={() => setIsSidebarOpen(false)}></div>
      <Sidebar
        conversations={conversations}
        setConversations={setConversations}
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
        theme={theme}
        setTheme={setTheme}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className="main-container">
        <header className="main-header">
          <button onClick={() => setIsSidebarOpen(true)} className="sidebar-toggle">
            <Menu size={18} />
          </button>
        </header>
        {currentConversation.messages.length === 0 ? (
          <div className="welcome-container">
            <img className="welcome-logo" src="/neu.png" alt="NEU Logo" />
            <h1 className="welcome-heading">Message OrgAIze</h1>
            <p className="welcome-text">Ask me. I'm here to help!</p>
          </div>
        ) : (
          <div className="messages-container" ref={messagesContainerRef}>
            {currentConversation.messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </div>
        )}
        <div className="prompt-container">
          <div className="prompt-wrapper">
            <PromptForm
              conversations={conversations}
              setConversations={setConversations}
              activeConversation={activeConversation}
              generateResponse={generateResponse}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
          <p className="disclaimer-text">OrgAIze can make mistakes, so double-check it.</p>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} /> {/* Default route - Chat interface */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

          {/* <Route path="/student-dashboard" element={<Student />} /> */}
           {/* Route for your Student component */}

 

        {/* You can add a redirect for the root path if you want to start at login */}
        {/* <Route path="/" element={<Navigate to="/login" />} /> */}
      </Routes>
    </Router>
  );
};

export default App;