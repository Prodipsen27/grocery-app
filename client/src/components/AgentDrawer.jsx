import React, { useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';
import { Bot, Send, X, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const AgentDrawer = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/assistant';

  const {
    user,
    isAgentDrawerOpen,
    setIsAgentDrawerOpen,
    agentMessages: messages,
    agentInput: inputVal,
    setAgentInput: setInputVal,
    agentLoading: loading,
    agentInitialLoading: initialLoading,
    loadAgentHistory,
    handleAgentSend
  } = useAppContext();

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (user && isAgentDrawerOpen && messages.length === 0 && !initialLoading) {
      loadAgentHistory();
    }
  }, [isAgentDrawerOpen, user]);

  useEffect(() => {
    if (isAgentDrawerOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isAgentDrawerOpen]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;
    handleAgentSend(inputVal);
    setInputVal('');
  };

  if (!user) return null;

  return (
    <>
      <AnimatePresence>
        {isAgentDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAgentDrawerOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 lg:hidden" // Only dim on mobile/tablet
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-[80px] right-0 h-[calc(100vh-80px)] w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col border-l border-green-50"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-green-50 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                    <img
                      src="/leafy.png"
                      alt="AI"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 leading-tight">Leafy</h2>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide font-semibold">Your Grocery Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAgentDrawerOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 custom-scrollbar bg-[#F8FAF9] relative">
              {initialLoading && messages.length === 0 && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <Loader2 className="animate-spin text-green-500 w-8 h-8" />
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`relative px-4 py-3 max-w-[85%] rounded-2xl text-[14.5px] leading-relaxed 
                      ${msg.role === 'user'
                        ? 'bg-gradient-to-br from-[#1B6F32] to-green-700 text-white rounded-tr-sm shadow-sm'
                        : 'bg-white border border-green-100 shadow-sm text-gray-800 rounded-tl-sm [&>p]:mb-1.5 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-2 [&>ul>li]:mb-0.5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-2 [&>ol>li]:mb-0.5 [&>strong]:font-bold'
                      }`}
                  >
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start">
                  <div className="px-4 py-3.5 bg-white border border-green-100 shadow-sm text-gray-800 rounded-2xl rounded-tl-sm flex items-center gap-2">
                    <div className="flex gap-1">
                      <motion.div animate={{y:[0,-4,0]}} transition={{repeat:Infinity, duration:0.6}} className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <motion.div animate={{y:[0,-4,0]}} transition={{repeat:Infinity, duration:0.6, delay:0.2}} className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <motion.div animate={{y:[0,-4,0]}} transition={{repeat:Infinity, duration:0.6, delay:0.4}} className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={onSubmit} className="p-4 bg-white border-t border-gray-100 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Tell Leafy what to find..."
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-full py-3.5 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition shadow-sm cursor-pointer"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
      </AnimatePresence>

      {/* Persistent Floating Action Button */}
      {!isAgentDrawerOpen && !isDashboard && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAgentDrawerOpen(true)}
          className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl z-40 cursor-pointer border border-gray-200 overflow-hidden group"
        >
          <img src="/leafy.png" alt="Leafy Assistant" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
          {loading && (
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
            </span>
          )}
        </motion.button>
      )}
    </>
  );
};

export default AgentDrawer;
