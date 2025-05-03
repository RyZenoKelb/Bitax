// src/components/Chatbot.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: input, history: messages }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    const assistantMessage: Message = { role: 'assistant', content: data.message };
    setMessages((prev) => [...prev, assistantMessage]);
  };

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-[9999]"
      >
        💬
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-8 w-80 h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-lg z-[9999] flex flex-col overflow-hidden"
          >
            <div className="p-4 font-bold bg-primary-500 text-white dark:bg-gray-900">
              Bitax Assistant
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-primary-100 text-right dark:bg-gray-700'
                      : 'bg-secondary-100 text-left dark:bg-gray-600'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex border-t border-gray-200 dark:border-gray-700">
              <input
                className="flex-1 p-2 text-sm bg-transparent focus:outline-none dark:text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage();
                }}
                placeholder="Posez une question..."
              />
              <button
                className="px-4 text-primary-600 dark:text-secondary-400 font-bold"
                onClick={sendMessage}
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
