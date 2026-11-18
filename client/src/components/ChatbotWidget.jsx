import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Welcome to Nova Infotech Corporate Desk! How can I assist you with bulk hardware procurement, rental fleets, or component specifications today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'ThinkPads available for rent?',
    'What is your replacement SLA?',
    'Do you buy old office PCs?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMessage = { sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: text });
      if (res.data.success) {
        setMessages((prev) => [...prev, { sender: 'bot', text: res.data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: 'Our desk is currently busy. Please reach our direct line at +91 98765 43210 or ping us on WhatsApp.'
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Our consultation desk is handling multiple inquiries right now. Please message us on WhatsApp for an immediate response!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Minimized Toggle Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0D3B2A] border border-[#D4A24C]/60 text-[#FAF7F2] text-xs font-semibold shadow-2xl hover:bg-[#153423] transition group"
        >
          <span className="w-2 h-2 rounded-full bg-[#D4A24C] animate-pulse"></span>
          <Bot className="w-4 h-4 text-[#D4A24C] group-hover:scale-110 transition" />
          <span className="uppercase tracking-wider text-[11px] font-bold">IT Consultant</span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="bg-[#FAF7F2] border border-[#D4A24C]/40 rounded-3xl shadow-2xl w-[340px] sm:w-[380px] h-[500px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#072117] p-4 text-white flex items-center justify-between border-b border-[#D4A24C]/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#0D3B2A] border border-[#D4A24C]/50 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#D4A24C]" />
              </div>
              <div>
                <h4 className="text-xs font-bold flex items-center gap-1.5 font-serif">
                  Nova IT Desk
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#D4A24C]/20 text-[#D4A24C] border border-[#D4A24C]/40 font-mono">
                    Online
                  </span>
                </h4>
                <p className="text-[10px] text-slate-300">Enterprise Hardware & Rental Advisory</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none flex items-center gap-2 text-slate-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about laptop specs, rentals, stock..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition shadow"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
