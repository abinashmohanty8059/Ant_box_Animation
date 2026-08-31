import { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  const lottieContainerRef = useRef(null);
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);
  const lottieAnimRef = useRef(null);

  // Initialize Lottie Animation
  useEffect(() => {
    if (lottieContainerRef.current) {
      lottieAnimRef.current = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/assets/Confused_student.json'
      });
    }
    return () => {
      if (lottieAnimRef.current) {
        lottieAnimRef.current.destroy();
        lottieAnimRef.current = null;
      }
    };
  }, []);

  // Scroll messages body to bottom on updates
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input field when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const openChat = () => {
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;

    const userMsg = { id: Date.now(), text, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // Simulate bot reply after 1000ms delay
    setTimeout(() => {
      let botText = "Thank you for asking! I'm the AntBox AI Assistant. I can help you learn more about our Sprints, AI Readiness score, or connecting with Tribes. Feel free to explore our Platform or Solutions sections!";
      const query = text.toLowerCase();
      if (query.includes('sprint')) {
        botText = "AntBox Sprints are intensive, guided skill programs designed by top experts. They focus on real-world briefs from top enterprises to prepare you for actual work environments.";
      } else if (query.includes('score') || query.includes('ready')) {
        botText = "Your AI Readiness Score is calculated by evaluating your active participation, problem-solving speed, and output quality across multiple Sprints. Employers trust this score over generic resumes!";
      } else if (query.includes('tribe') || query.includes('corporate')) {
        botText = "Tribes are vetted, pre-validated talent groups that match specific corporate needs. Companies can query our Tribe Analytics Engine to find candidate readiness profiles instantly.";
      }

      const botMsg = { id: Date.now() + 1, text: botText, sender: 'bot' };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* MINI CHAT BOX WINDOW */}
      <button 
        className={`chat-trigger ${isOpen ? 'hidden' : ''}`} 
        id="chatTrigger" 
        aria-label="Open chat widget"
        onClick={openChat}
      >
        <svg className="chat-icon-svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor"
            d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
        </svg>
      </button>

      <div className={`chat-window ${isOpen ? 'open' : ''}`} id="chatWindow" aria-hidden={!isOpen}>
        <div className="chat-header">
          <div className="chat-header-info">
            <span className="chat-header-dot"></span>
            <span className="chat-header-title">AntBox Assistant</span>
          </div>
          <button className="chat-close-btn" id="chatCloseBtn" aria-label="Close chat widget" onClick={closeChat}>&times;</button>
        </div>

        <div ref={chatBodyRef} className="chat-body">
          <div ref={lottieContainerRef} className="chat-lottie-container" id="chatLottie"></div>

          {messages.length === 0 && (
            <div className="chat-welcome" id="chatWelcome">
              <h3 className="chat-welcome-title">Ask us anything</h3>
              <p className="chat-welcome-text">What would you like to find out about your campus-to-corporate readiness journey?
              </p>
            </div>
          )}

          <div className="chat-messages" id="chatMessages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
        </div>

        <div className="chat-footer">
          <input 
            ref={inputRef}
            type="text" 
            className="chat-input" 
            id="chatInput" 
            placeholder="Type a message..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="chat-send-btn" id="chatSendBtn" aria-label="Send message" onClick={handleSend}>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
