import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AIContext } from '../context/AIContext';
import { MessageSquare, Sparkles, X, Send, User, HelpCircle, CheckSquare, Square } from 'lucide-react';

const AICopilot = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { sendChatQuery } = useContext(AIContext);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Set up welcome message based on role
  useEffect(() => {
    if (isAuthenticated && user) {
      const isHR = user.role === 'hr';
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: isHR 
            ? `### 🤖 Guruji AI Talent Copilot (Admin Mode)
Hello **${user.name}**! I am your AI corporate talent assistant. I analyze active personnel metrics to help you optimize department productivity, evaluate growth parameters, and draft performance guides.

How can I assist you with your department management today?`
            : `### 🤖 Guruji AI Career Mentor (Employee Mode)
Hello **${user.name}**! I am your AI career mentor. I am here to help you expand your skill matrix, master advanced systems, and scale your performance score.

What career questions or roadmap details would you like to discuss today?`
        }
      ]);
    }
  }, [user, isAuthenticated]);

  if (!isAuthenticated || !user) return null;

  const isHR = user.role === 'hr';

  // Role-appropriate quick suggestions
  const suggestions = isHR 
    ? [
        { label: '🏆 Who is eligible for promotion?', text: 'Who is eligible for a promotion?' },
        { label: "📈 Guide for Rohan Das's score", text: "How can I improve Rohan Das's score?" },
        { label: '🎨 Priya Patel roadmap advice', text: 'What is the training roadmap for Priya Patel?' },
        { label: '📊 Overall department health audit', text: 'Get an overall department health audit' }
      ]
    : [
        { label: '🚀 How to boost my score?', text: 'How can I improve my performance rating?' },
        { label: '💡 What skills should I learn next?', text: 'Which skills should I learn next?' },
        { label: '🏆 Am I ready for a promotion?', text: 'Am I ready for a promotion?' }
      ];

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    const userMsgId = 'msg_' + Date.now();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text }]);
    setInputText('');
    setLoading(true);

    try {
      const reply = await sendChatQuery(text);
      const botMsgId = 'msg_' + (Date.now() + 1);
      setMessages(prev => [...prev, { id: botMsgId, sender: 'bot', text: reply }]);
    } catch (err) {
      const errId = 'msg_err_' + Date.now();
      setMessages(prev => [...prev, { 
        id: errId, 
        sender: 'bot', 
        text: `⚠️ **Error communicating with Copilot:**\n\n${err.message || 'Please check your internet or key credits.'}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Ultra-premium custom HTML/React inline Markdown formatter to avoid npm dependency mismatches
  const formatMarkdown = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();

      // Headers (e.g. ### Header)
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-extrabold text-brand-400 mt-4 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" /> {trimmed.substring(4)}
          </h4>
        );
      }

      // Checkboxes checked [x]
      if (trimmed.startsWith('* [x]') || trimmed.startsWith('- [x]')) {
        const textContent = trimmed.substring(5).trim();
        return (
          <div key={idx} className="flex items-start gap-2 text-xs text-emerald-400 font-semibold my-1.5 pl-2">
            <CheckSquare className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{parseInlineBold(textContent)}</span>
          </div>
        );
      }

      // Checkboxes unchecked [ ]
      if (trimmed.startsWith('* [ ]') || trimmed.startsWith('- [ ]')) {
        const textContent = trimmed.substring(5).trim();
        return (
          <div key={idx} className="flex items-start gap-2 text-xs text-slate-400 my-1.5 pl-2">
            <Square className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
            <span>{parseInlineBold(textContent)}</span>
          </div>
        );
      }

      // Bullet Lists (e.g. * Item)
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const textContent = trimmed.substring(2);
        return (
          <div key={idx} className="flex items-start gap-2 text-xs text-slate-350 my-1 pl-4 leading-relaxed">
            <span className="text-brand-500 font-bold shrink-0 mt-0.5">•</span>
            <span>{parseInlineBold(textContent)}</span>
          </div>
        );
      }

      // Ordered Lists (e.g. 1. Item)
      const listMatch = trimmed.match(/^(\d+)\.\s(.*)/);
      if (listMatch) {
        const number = listMatch[1];
        const textContent = listMatch[2];
        return (
          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 my-1.5 pl-4 leading-relaxed">
            <span className="text-indigo-400 font-extrabold shrink-0 mt-0.5">{number}.</span>
            <span>{parseInlineBold(textContent)}</span>
          </div>
        );
      }

      // Default paragraphs
      if (trimmed.length === 0) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-xs text-slate-300 leading-relaxed mb-1">
          {parseInlineBold(trimmed)}
        </p>
      );
    });
  };

  // Parse **bold text** inside paragraphs
  const parseInlineBold = (text) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => {
      // Every odd element is bold
      if (i % 2 === 1) {
        return <strong key={i} className="text-slate-100 font-extrabold bg-slate-900/50 px-1 rounded border border-slate-850/50">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating launcher bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white p-4 rounded-full shadow-2xl shadow-brand-500/30 transition-all duration-300 hover:scale-115 cursor-pointer flex items-center justify-center border border-brand-400/20 active:scale-95 animate-bounce-subtle"
        title="AI Career & Talent Copilot"
        id="ai-copilot-launcher"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {/* Slide-over chatbot panel */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-8rem)] rounded-3xl bg-slate-950/95 border border-slate-850 shadow-2xl shadow-black/80 flex flex-col overflow-hidden animate-slide-up backdrop-blur-xl font-sans"
          id="ai-copilot-window"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-950/60 to-indigo-950/60 px-5 py-4 border-b border-slate-850 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-brand-500 to-indigo-500 p-2 rounded-xl text-white">
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-100 tracking-wider uppercase">Guruji AI Copilot</h3>
                <span className="text-[10px] text-brand-400 font-bold uppercase tracking-widest block mt-0.5">
                  {isHR ? 'Talent Operations Co-Pilot' : 'Personal Career Mentor'}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages display */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-brand-950/80 border border-brand-500/20 text-brand-400'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="h-3.5 w-3.5" /> : 'G'}
                </div>

                {/* Msg text */}
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600/90 text-white rounded-tr-none'
                      : 'bg-slate-900/60 border border-slate-850/80 text-slate-200 rounded-tl-none font-medium'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div>{formatMarkdown(msg.text)}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing state indicator */}
            {loading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="h-7 w-7 rounded-lg bg-brand-950/80 border border-brand-500/20 text-brand-400 flex items-center justify-center text-xs font-bold">
                  G
                </div>
                <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="h-1.5 w-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="h-1.5 w-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Click Suggestions */}
          {messages.length === 1 && !loading && (
            <div className="px-4 py-2 border-t border-slate-850/60 bg-slate-950/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block flex items-center gap-1">
                <HelpCircle className="h-3 w-3" /> Quick Suggestion Chips
              </span>
              <div className="flex flex-col gap-1.5">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sug.text)}
                    className="text-left text-[11px] text-slate-400 hover:text-indigo-300 bg-slate-900/50 hover:bg-slate-900 border border-slate-850 hover:border-indigo-900/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium tracking-wide shadow-sm"
                  >
                    {sug.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TextInput container */}
          <div className="p-4 border-t border-slate-850 bg-slate-950/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={isHR ? "Ask Talent Copilot..." : "Ask Career Mentor..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loading}
                className="flex-1 bg-slate-900/80 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="bg-brand-600 hover:bg-brand-500 disabled:bg-slate-900 disabled:text-slate-600 text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-brand-600/10 active:scale-95 shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AICopilot;
