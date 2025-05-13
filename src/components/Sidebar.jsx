import './Sidebar.css'; 
import { Menu, Moon, Plus, Sparkles, Sun, Trash2, ArrowLeft } from "lucide-react";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, conversations, setConversations, activeConversation, setActiveConversation, theme, setTheme, onBack }) => {
  // Create new conversation
  const createNewConversation = () => {
    // Check if any existing conversation is empty
    const emptyConversation = conversations.find((conv) => conv.messages.length === 0);
    if (emptyConversation) {
      // If an empty conversation exists, make it active instead of creating a new one
      setActiveConversation(emptyConversation.id);
      return;
    }
    // Only create a new conversation if there are no empty ones
    const newId = `conv-${Date.now()}`;
    setConversations([{ id: newId, title: "New Chat", messages: [] }, ...conversations]);
    setActiveConversation(newId);
  };

  // Handle back button click
  const BackButton = () => {
    if (onBack) {
      onBack();
    }
    else {
      window.location.reload();
    }
  };

  // Delete conversation and handle active selection
  const deleteConversation = (id, e) => {
    e.stopPropagation(); // Prevent triggering conversation selection
    // Check if this is the last conversation
    if (conversations.length === 1) {
      // Create new conversation with ID "default"
      const newConversation = { id: "default", title: "New Chat", messages: [] };
      setConversations([newConversation]);
      setActiveConversation("default"); // Set active to match the new conversation ID
    } else {
      // Remove the conversation
      const updatedConversations = conversations.filter((conv) => conv.id !== id);
      setConversations(updatedConversations);
      // If deleting the active conversation, switch to another one
      if (activeConversation === id) {
        // Find the first conversation that isn't being deleted
        const nextConversation = updatedConversations[0];
        setActiveConversation(nextConversation.id);
      }
    }
  };

  return (
    <aside className={`sidebar relative ${isSidebarOpen ? "open" : "closed"}`}>
      {/* Back Button - positioned at the top left corner */}
      <div className="backbutton-container">
        <button className="backbutton flex items-center" onClick={BackButton}>
          <ArrowLeft size={16} />
        </button>
      </div>
      
      {/* Sidebar Header */}
      <div className="sidebar-header flex justify-between items-center py-4 px-4 mt-2">
        <button className="sidebar-toggle" onClick={() => setIsSidebarOpen((prev) => !prev)}>
          <Menu size={18} />
        </button>
        <button className="new-chat-btn flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700" onClick={createNewConversation}>
          <Plus size={20} />
          <span>New chat</span>
        </button>
      </div>

      {/* Conversation List */}
      <div className="sidebar-content px-3 overflow-y-auto">
        <h2 className="sidebar-title text-sm font-medium mb-2">Chat history</h2>
        <ul className="conversation-list">
          {conversations.map((conv) => (
            <li key={conv.id} className={`conversation-item flex justify-between items-center p-2 rounded-lg mb-1 ${activeConversation === conv.id ? "active bg-gray-200 dark:bg-gray-700" : ""}`} onClick={() => setActiveConversation(conv.id)}>
              <div className="conversation-icon-title flex items-center gap-2">
                <div className="conversation-icon flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600">
                  <Sparkles size={14} />
                </div>
                <span className="conversation-title text-sm truncate">{conv.title}</span>
              </div>
              {/* Only show delete button if more than one chat or not a new chat */}
              <button className={`delete-btn opacity-0 hover:opacity-100 ${conversations.length > 1 || conv.title !== "New Chat" ? "" : "hide"}`} onClick={(e) => deleteConversation(conv.id, e)}>
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Theme Toggle in Footer */}
      <div className="sidebar-footer absolute bottom-4 right-4">
        <button className="theme-toggle flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? (
            <>
              <Moon size={20} />
              <span>Dark mode</span>
            </>
          ) : (
            <>
              <Sun size={20} />
              <span>Light mode</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
