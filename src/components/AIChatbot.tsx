"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./AIChatbot.module.css";

interface Message {
  role: "user" | "bot";
  text: string;
}

interface ChatResponse {
  text?: string;
  error?: string;
  details?: string;
}

interface VoiceCallResponse {
  success?: boolean;
  message?: string;
  error?: string;
  details?: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi! I'm Nami, Himanshu's AI assistant. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle outside clicks and scrolling to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = (await response.json()) as ChatResponse;
      if (!response.ok || data.error) {
        const errorMsg = data.details || data.error || "Server error";
        setMessages(prev => [...prev, { role: "bot", text: `Sorry, I'm having trouble connecting right now (${errorMsg}). Please check if the service is available.` }]);
      } else {
        setMessages(prev => [...prev, { role: "bot", text: data.text || "I couldn't generate a response right now. Please try again." }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Something went wrong. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceCall = async () => {
    if (!phoneNumber.trim() || isCalling) return;

    setIsCalling(true);

    try {
      const response = await fetch("/api/voice/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
      });

      const data = (await response.json()) as VoiceCallResponse;

      if (!response.ok || data.error) {
        const errorMsg = data.details || data.error || "Unable to start call";
        setMessages(prev => [...prev, { role: "bot", text: `Voice call failed: ${errorMsg}` }]);
      } else {
        setMessages(prev => [...prev, { role: "bot", text: data.message || "Nami is calling now." }]);
        setPhoneNumber("");
      }
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Voice call failed. Please try again later." }]);
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {isOpen && (
        <div className={styles.window}>
          <div className={styles.header}>
            <div className={styles.botInfo}>
              <div className={styles.botIcon}>
                <img src="https://cdn-icons-gif.flaticon.com/11184/11184177.gif" alt="Nami" />
              </div>
              <span>Nami</span>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat">×</button>
          </div>
          <div className={styles.body}>
            <div className={styles.voicePanel}>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91..."
                disabled={isCalling}
              />
              <button onClick={handleVoiceCall} disabled={isCalling || !phoneNumber.trim()}>
                {isCalling ? "Calling" : "Voice call"}
              </button>
            </div>
            <div className={styles.messages}>
              {messages.map((msg, i) => (
                <div key={i} className={`${styles.message} ${styles[msg.role]}`}>
                  <div className={styles.bubble}>{msg.text}</div>
                </div>
              ))}
              {isLoading && (
                <div className={`${styles.message} ${styles.bot}`}>
                  <div className={styles.bubble}>...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className={styles.footer}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything about Himanshu..."
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
      <button 
        className={styles.trigger} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Nami Assistant"
      >
        <img src="https://cdn-icons-gif.flaticon.com/11184/11184177.gif" alt="Nami Icon" className={styles.triggerIcon} />
      </button>
    </div>
  );
}
