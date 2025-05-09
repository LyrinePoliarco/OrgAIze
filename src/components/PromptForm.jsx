import { ArrowUp } from "lucide-react";
import { useState } from "react";
const PromptForm = ({ conversations, setConversations, activeConversation, generateResponse, isLoading, setIsLoading }) => {
  const [promptText, setPromptText] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading || !promptText.trim()) return;
    setIsLoading(true);
    const currentConvo = conversations.find((convo) => convo.id === activeConversation) || conversations[0];
    // Set conversation title from first message if new chat
    let newTitle = currentConvo.title;
    if (currentConvo.messages.length === 0) {
      newTitle = promptText.length > 25 ? promptText.substring(0, 25) + "..." : promptText;
    }
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: promptText,
    };
    // Create API conversation without the "thinking" message
    const apiConversation = {
      ...currentConvo,
      messages: [...currentConvo.messages, userMessage],
    };
    // Update UI with user message
    setConversations(conversations.map((conv) => (conv.id === activeConversation ? { ...conv, title: newTitle, messages: [...conv.messages, userMessage] } : conv)));
    // Clear input
    setPromptText("");
    // Add bot response after short delay for better UX
    setTimeout(() => {
      const botMessageId = `bot-${Date.now()}`;
      const botMessage = {
        id: botMessageId,
        role: "bot",
        content: "Just a sec...",
        loading: true,
      };
      // Only update the UI with the thinking message, not the conversation for API
      setConversations((prev) => prev.map((conv) => (conv.id === activeConversation ? { ...conv, title: newTitle, messages: [...conv.messages, botMessage] } : conv)));
      // Pass the API conversation without the thinking message
      generateResponse(apiConversation, botMessageId);
    }, 300);
  };
  return (
    <form className="prompt-form" onSubmit={handleSubmit}>
      <input placeholder="Message OrgAIze..." className="prompt-input" value={promptText} onChange={(e) => setPromptText(e.target.value)} required />
      <button type="submit" className="send-prompt-btn">
        <ArrowUp size={20} />
      </button>
    </form>
  );
};
export default PromptForm;