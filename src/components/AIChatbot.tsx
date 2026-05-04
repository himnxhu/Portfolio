"use client";

import { useState } from "react";
import styles from "./AIChatbot.module.css";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      {isOpen && (
        <div className={styles.window}>
          <div className={styles.header}>
            <span>AI Assistant</span>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className={styles.body}>
            <p>Hi! I can help you learn more about Alex&apos;s experience. (AI integration coming soon)</p>
          </div>
        </div>
      )}
      <button 
        className={styles.trigger} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Assistant"
      >
        <span>🤖</span>
      </button>
    </div>
  );
}
