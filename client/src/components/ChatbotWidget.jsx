import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useCompany } from '../context/SettingsContext';

export default function ChatbotWidget() {
  const { company } = useCompany();
  const brandName = company?.brand_name || 'Demo Infotech';
  const brandPhone = company?.phone || '+91 XXXXX XXXXX';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Welcome to ${brandName} Corporate Desk! How can I assist you with bulk hardware procurement, rental fleets, or component specifications today?`
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
      if (res.data?.success) {
        setMessages((prev) => [...prev, { sender: 'bot', text: res.data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `Our desk is currently busy. Please reach our direct line at ${brandPhone} or ping us on WhatsApp.`
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
    <div className="fixed bottom-5 left-5 z-40">
      {/* Minimized Toggle Round Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-12 h-12 rounded-full bg-[#072117]/90 border border-[#D4A24C]/60 text-[#D4A24C] shadow-[0_8px_25px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group cursor-pointer backdrop-blur-md"
          title={`${brandName} AI Consultant`}
        >
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#10B981]" />
          <Bot className="w-5 h-5 text-[#D4A24C] group-hover:scale-110 transition-transform" />
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
                  {brandName} Desk
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#D4A24C]/20 text-[#D4A24C] border border-[#D4A24C]/40 font-mono">
                    Online
                  </span>
                </h4>
                <p className="text-[10px] text-slate-300">Enterprise Hardware & Rental Advisory</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-[#FAF7F2] px-3 py-2 border-b border-[#0D3B2A]/10 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-[#D4A24C]/30 text-slate-700 hover:border-[#0D3B2A] hover:text-[#0D3B2A] transition cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF7F2] text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-[#0D3B2A] text-white rounded-br-none shadow-sm'
                      : 'bg-white text-slate-800 border border-[#D4A24C]/25 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#D4A24C]/30 p-3 rounded-2xl rounded-bl-none flex items-center gap-2 text-slate-600">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0D3B2A]" />
                  <span>Consulting catalog...</span>
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
            className="p-3 bg-white border-t border-[#0D3B2A]/10 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about laptop specs, rentals, stock..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#FAF7F2] border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0D3B2A] transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-[#0D3B2A] hover:bg-[#124e38] disabled:opacity-50 text-white transition shadow cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#D4A24C]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
