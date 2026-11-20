import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useCompany } from '../context/SettingsContext';
import { useReducedMotionSafe } from '../animations';

/**
 * FormattedBotMessage
 * Parses and renders Markdown (bold **text**, bullet lists, clean headers)
 * completely eliminating raw unparsed asterisks (***) for an Apple-grade clean reading experience.
 */
function FormattedBotMessage({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  const renderInline = (str) => {
    const parts = [];
    const regex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={match.index} className="font-bold text-[#0D3B2A]">
          {match[1]}
        </strong>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }
    return parts.length > 0 ? parts : str;
  };

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-1.5 space-y-1 pl-4 list-disc marker:text-[#D4A24C]">
          {currentList.map((li, i) => (
            <li key={i} className="text-xs leading-relaxed text-slate-800">
              {renderInline(li)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    // Bullet line: * or - or •
    const bulletMatch = trimmed.match(/^[*\-•]\s+(.*)$/);
    if (bulletMatch) {
      currentList.push(bulletMatch[1]);
    } else {
      flushList();
      // Standalone bold header line: **Header**
      const titleMatch = trimmed.match(/^\*\*(.+?)\*\*$/);
      if (titleMatch) {
        elements.push(
          <p key={idx} className="font-bold text-xs text-[#0D3B2A] mt-2 mb-0.5">
            {titleMatch[1]}
          </p>
        );
      } else {
        elements.push(
          <p key={idx} className="text-xs leading-relaxed my-0.5 text-slate-800">
            {renderInline(trimmed)}
          </p>
        );
      }
    }
  });

  flushList();
  return <div className="space-y-0.5">{elements}</div>;
}

export default function ChatbotWidget() {
  const { company } = useCompany();
  const brandName = company?.brand_name || 'Demo Infotech';
  const brandPhone = company?.phone || '+91 XXXXX XXXXX';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Welcome to ${brandName} Desk! How can I assist you with laptop sales, corporate rentals, or hardware specifications today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'Buy or Rent Laptops?',
    'ThinkPads available in stock?',
    'What is your replacement SLA?'
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
      const historyContext = messages.slice(-6);
      const res = await api.post('/ai/chat', { 
        message: text,
        history: historyContext
      });
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
    } catch {
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

  const shouldReduce = useReducedMotionSafe();

  return (
    <div className="fixed bottom-5 left-5 z-40">
      {/* Minimized Toggle Round Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setIsOpen(true)}
            className="relative w-12 h-12 rounded-full bg-[#072117]/90 border border-[#D4A24C]/60 text-[#D4A24C] shadow-[0_8px_25px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group cursor-pointer backdrop-blur-md"
            title={`${brandName} AI Consultant`}
          >
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <Bot className="w-5 h-5 text-[#D4A24C] group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#FAF7F2] border border-[#D4A24C]/40 rounded-3xl shadow-2xl w-[330px] sm:w-[370px] max-w-[calc(100vw-2.5rem)] h-[470px] max-h-[80vh] flex flex-col overflow-hidden"
          >
          {/* Header */}
          <div className="bg-[#072117] p-3.5 sm:p-4 text-white flex items-center justify-between border-b border-[#D4A24C]/30 shrink-0">
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
                <p className="text-[10px] text-slate-300">Sales, Rentals & Hardware Solutions</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts Bar (No ugly horizontal scrollbar) */}
          <div className="bg-[#FAF7F2] px-3 py-2 border-b border-[#0D3B2A]/10 flex items-center gap-1.5 overflow-x-auto text-[11px] hide-scrollbar shrink-0">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-[#D4A24C]/35 text-slate-700 hover:border-[#0D3B2A] hover:bg-emerald-50/50 hover:text-[#0D3B2A] transition text-[10.5px] font-medium shadow-2xs cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-2.5 bg-[#FAF7F2] text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-2xl leading-relaxed shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-[#0D3B2A] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-[#D4A24C]/25 rounded-bl-none'
                  }`}
                >
                  {m.sender === 'user' ? (
                    <p className="text-xs">{m.text}</p>
                  ) : (
                    <FormattedBotMessage text={m.text} />
                  )}
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
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
