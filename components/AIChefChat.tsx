import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, ChefHat, Zap, Plus, Mic, Image as ImageIcon, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../types';
import { streamChatResponse } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const AIChefChat: React.FC = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
       setMessages([{
        id: 'welcome',
        role: 'model',
        text: t('chat_welcome'),
        timestamp: new Date()
      }]);
    }
  }, [t, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setShowQuickActions(false);

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const stream = streamChatResponse(history, userMsg.text, language);
      
      let fullResponse = "";
      const modelMsgId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, {
        id: modelMsgId,
        role: 'model',
        text: "",
        timestamp: new Date()
      }]);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(m => 
          m.id === modelMsgId ? { ...m, text: fullResponse } : m
        ));
      }

    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  // Quick action prompts
  const quickActions = [
    { icon: '🥗', text: 'Quick healthy lunch', gradient: 'from-emerald-400 to-teal-400' },
    { icon: '🍳', text: 'Breakfast under 15min', gradient: 'from-amber-400 to-orange-400' },
    { icon: '🥘', text: 'Use leftover ingredients', gradient: 'from-rose-400 to-pink-400' },
    { icon: '🌱', text: 'High protein meal', gradient: 'from-violet-400 to-purple-400' },
  ];

  // --- Generative UI Widgets ---
  const renderAttachments = (msg: ChatMessage) => {
    const lowerText = msg.text.toLowerCase();
    if (msg.role === 'model' && (lowerText.includes('substitute') || lowerText.includes('replace') || lowerText.includes('egg'))) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full mt-4 p-4 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-3xl text-white shadow-2xl border border-stone-700/30 overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 to-amber-500/10" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center">
                        <Sparkles size={14} className="text-white" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-200">Smart Swap</span>
                  </div>
                  <p className="text-stone-300 text-xs mb-3 font-medium">Try these from your pantry:</p>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {['🍌 1/2 Banana', '🍎 1/4c Applesauce', '🌾 1tbsp Flax'].map((opt, idx) => (
                      <motion.button 
                        key={opt}
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl text-xs font-bold whitespace-nowrap border border-white/20 transition-all active:scale-95 shadow-lg"
                      >
                          {opt}
                      </motion.button>
                      ))}
                  </div>
                </div>
            </motion.div>
        );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex flex-col justify-end font-sans">
      
      {/* FLOATING ORB TRIGGER - Morphing Design */}
      <AnimatePresence>
        {!isOpen && (
            <motion.button
                initial={{ scale: 0, rotate: 180 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                }}
                exit={{ scale: 0, rotate: -180 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="pointer-events-auto absolute bottom-28 right-5 w-14 h-14 rounded-full flex items-center justify-center z-50 group overflow-hidden"
            >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500 via-orange-400 to-amber-400 animate-gradient-xy" />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.3, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-br from-rose-400 to-orange-500 blur-xl"
                />
                <MessageCircle className="text-white relative z-10" size={24} />
            </motion.button>
        )}
      </AnimatePresence>

      {/* IMMERSIVE FULLSCREEN CHAT */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="pointer-events-auto fixed inset-0 bg-gradient-to-b from-[#FAFAF9] via-white to-[#FFF7ED] flex flex-col overflow-hidden z-50"
          >
            {/* Subtle mesh gradient overlay */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-200 via-orange-100 to-amber-200 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-violet-200 via-indigo-100 to-blue-200 rounded-full blur-3xl" />
            </div>

            {/* MINIMAL HEADER */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative z-10 px-5 pt-3 pb-4 flex items-center justify-between"
            >
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-rose-500 via-orange-400 to-amber-400 flex items-center justify-center shadow-lg">
                    <ChefHat size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">AI Chef</h2>
                    <p className="text-[10px] text-stone-400 font-medium">Always here to help</p>
                  </div>
               </div>
               <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)} 
                className="w-9 h-9 bg-white/80 backdrop-blur-sm rounded-2xl text-stone-500 flex items-center justify-center hover:bg-white shadow-sm transition-all active:scale-95 border border-stone-100"
               >
                  <X size={18} />
               </motion.button>
            </motion.div>

            {/* MESSAGES STREAM - Bubble Style */}
            <div className="flex-1 overflow-y-auto px-4 space-y-4 pt-2 pb-40 relative z-10">
               {/* Quick Actions - Show when no messages */}
               {messages.length <= 1 && showQuickActions && (
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="mb-6"
                 >
                   <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 px-1">Quick Starts</p>
                   <div className="grid grid-cols-2 gap-2">
                     {quickActions.map((action, idx) => (
                       <motion.button
                         key={idx}
                         initial={{ scale: 0, rotate: -10 }}
                         animate={{ scale: 1, rotate: 0 }}
                         transition={{ delay: 0.1 + idx * 0.05 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => handleSend(action.text)}
                         className="p-4 bg-white/80 backdrop-blur-sm rounded-3xl border border-stone-100 hover:border-stone-200 shadow-sm hover:shadow-md transition-all text-left group active:scale-95"
                       >
                         <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-xl mb-2 shadow-lg group-hover:scale-110 transition-transform`}>
                           {action.icon}
                         </div>
                         <p className="text-xs font-bold text-stone-800 leading-tight">{action.text}</p>
                       </motion.button>
                     ))}
                   </div>
                 </motion.div>
               )}

               {messages.map((msg, idx) => (
                 <motion.div 
                   key={msg.id}
                   initial={{ opacity: 0, y: 20, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   transition={{ delay: idx * 0.05 }}
                   className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                 >
                    {msg.id !== 'welcome' && (
                      <>
                        {/* Message Bubble */}
                        <div className={`max-w-[85%] px-4 py-3 rounded-3xl text-sm leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-br-lg shadow-lg' 
                            : 'bg-white/80 backdrop-blur-sm text-stone-800 border border-stone-100 rounded-bl-lg shadow-sm'
                        }`}>
                           {msg.text || '...'}
                        </div>

                        {/* Timestamp */}
                        <span className="text-[9px] mt-1.5 px-2 text-stone-400 font-medium">
                            {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </>
                    )}

                    {/* Generative UI Widgets */}
                    {renderAttachments(msg)}

                 </motion.div>
               ))}
               
               {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-start gap-2"
                  >
                    <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-3xl rounded-bl-lg border border-stone-100 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* FLOATING INPUT BAR */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 bg-gradient-to-t from-white via-white/95 to-transparent pt-8 z-20">
               <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="bg-white/90 backdrop-blur-2xl rounded-3xl p-2 flex items-center gap-2 border border-stone-200/50 shadow-2xl shadow-stone-300/20"
               >
                  {/* Voice Input */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-2xl bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-600 transition-all active:scale-90"
                  >
                    <Mic size={18} />
                  </motion.button>

                  {/* Text Input */}
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    className="flex-1 bg-transparent border-none px-2 py-3 outline-none text-sm text-stone-900 placeholder:text-stone-400 font-medium"
                    placeholder="Ask anything..."
                    autoFocus={isOpen}
                  />

                  {/* Send Button */}
                  <motion.button 
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-90 ${
                      input.trim() 
                        ? 'bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 text-white hover:shadow-xl' 
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                     <Send size={18} className={input.trim() ? 'ml-0.5' : ''} />
                  </motion.button>
               </motion.div>

               {/* Action Pills */}
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.3 }}
                 className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide"
               >
                 {['📷 Scan ingredient', '🔥 Trending recipes', '💡 Tips'].map((action, idx) => (
                   <motion.button
                     key={idx}
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ delay: 0.4 + idx * 0.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="px-3 py-1.5 bg-white/60 backdrop-blur-sm hover:bg-white border border-stone-200/50 rounded-full text-[10px] font-bold text-stone-600 whitespace-nowrap transition-all active:scale-95 shadow-sm"
                   >
                     {action}
                   </motion.button>
                 ))}
               </motion.div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Styles for animations */}
      <style>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 0%; }
          25% { background-position: 100% 0%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 3s ease infinite;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AIChefChat;