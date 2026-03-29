import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Bot, Send, ShoppingCart, Loader2, Sparkles, CheckCircle2, Search, FileText, Truck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const AgentDashboard = () => {
  const { 
    user, navigate, getCartCount,
    agentMessages: messages, 
    agentInput: inputVal, setAgentInput: setInputVal,
    agentLoading: loading, 
    agentInitialLoading: initialLoading, 
    agentToolCalls: toolCalls, 
    loadAgentHistory, handleAgentSend 
  } = useAppContext();
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    if(user && messages.length === 0) {
      loadAgentHistory();
    }
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, toolCalls, loading]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;
    handleAgentSend(inputVal);
    setInputVal('');
  };

  // Helper to map tool calls to friendly UI messages on the left side
  const getToolActionText = (tool) => {
    const name = tool.toolName;
    const args = tool.input;
    
    switch(name) {
      case 'search_products': return { title: args.query || 'items', status: 'LOCATING...', color: 'text-amber-600', bg: 'bg-amber-100', progress: 50 };
      case 'add_to_cart': 
        const addedName = tool.result?.cart_item?.name || 'Item';
        return { title: addedName, status: 'ADDING TO CART...', color: 'text-green-600', bg: 'bg-green-100', progress: 100 };
      case 'update_quantity': return { title: 'Updating Quantity', status: 'ADJUSTING...', color: 'text-blue-600', bg: 'bg-blue-100', progress: 100 };
      case 'get_cart': return { title: 'Cart Summary', status: 'ANALYZING...', color: 'text-purple-600', bg: 'bg-purple-100', progress: 80 };
      case 'suggest_alternative': return { title: 'Finding Alternatives', status: 'SEARCHING...', color: 'text-orange-600', bg: 'bg-orange-100', progress: 60 };
      default: return { title: 'System Task', status: 'PROCESSING...', color: 'text-gray-600', bg: 'bg-gray-100', progress: 50 };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center bg-green-50">
        <Bot size={64} className="text-green-500 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">Please login to access your personal AI grocery assistant. I can help search for ingredients, add items to your cart, and suggest recipes!</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition shadow-lg shrink-0 cursor-pointer">
          Go back Home
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-[#F8FAF9] font-sans flex flex-col lg:flex-row px-4 sm:px-6 md:px-10 lg:px-16 gap-8 min-h-[calc(100vh-80px)]">
      
      {/* LEFT PANE: Active Visualization */}
      <div className="flex-1 bg-gradient-to-br from-[#E8F4EE] to-[#edebd5] rounded-[2.5rem] p-8 sm:p-12 relative shadow-sm border border-green-50/50 flex flex-col items-center">
        
        {/* Top Floating Badge */}
        <div className="w-16 h-16 bg-[#F4C137] rounded-full flex items-center justify-center shadow-lg shadow-yellow-200/50 mb-8 self-center">
          <Bot size={32} className="text-amber-900" />
        </div>

        <div className="text-center mb-10 w-full">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2F3631] tracking-tight leading-tight mb-4">
            Curating Your <span className="text-green-600 italic">Fresh Picks</span>
          </h1>
          <p className="text-[#6C7570] text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Leafy is cross-referencing local inventory with your dietary preferences and seasonal freshness metrics.
          </p>
        </div>

        {/* Activity Cards Layout */}
        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto w-full flex-1 align-top items-start auto-rows-max">
          <AnimatePresence>
            {toolCalls.length === 0 && !loading && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="col-span-2 text-center text-gray-400 font-medium py-10"
              >
                Waiting for your instructions...
              </motion.div>
            )}

            {toolCalls.map((tool, idx) => {
              const info = getToolActionText(tool);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15, duration: 0.4 }}
                  className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-sm border border-white"
                >
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="font-bold text-gray-800 text-lg capitalize">{info.title}</h3>
                    <span className={`text-[10px] font-bold tracking-wider ${info.color}`}>
                      {info.status}
                    </span>
                  </div>
                  
                  {/* Progress Bar Visual */}
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: `${info.progress}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.15 }}
                      className={`h-full ${info.bg.replace('bg-', 'bg-').replace('100', '500')}`}
                    />
                  </div>
                  
                  <p className="text-xs text-gray-500 truncate mt-3">
                    {tool.result?.success ? (
                       <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500"/> Sequence completed successfully</span>
                    ) : (
                       <span className="flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Gathering product data...</span>
                    )}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Pro Tip Box (Bottom Left) */}
        {toolCalls.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="mt-auto bg-[#FDECB1] rounded-2xl p-5 flex items-center justify-between gap-4 border border-[#F4C137]/30"
          >
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 bg-[#F4C137] rounded-full flex items-center justify-center shrink-0">
                <Sparkles size={20} className="text-amber-900" />
              </div>
              <p className="text-sm text-amber-900 font-medium leading-snug">
                <strong className="font-bold">Pro Tip:</strong> The freshest seasonal items are usually listed first in the search results!
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* RIGHT PANE: Assistant UI */}
      <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-6">
        
        {/* Chat Header */}
        <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-green-50">
          <div className="relative">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
              <img src="/leafy.png" alt="Leafy AI" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-lg leading-tight">Leafy AI</h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-0.5">Ready to find fresh picks</p>
          </div>
        </div>

        {/* Chat History Container */}
        <div className="h-[400px] lg:h-[450px] bg-white rounded-[2rem] shadow-sm border border-green-50 p-6 flex flex-col">
          
          <div className="flex-1 overflow-y-auto w-full pr-2 space-y-6 custom-scrollbar relative">
            {initialLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-[2rem]">
                <Loader2 className="animate-spin text-green-500 w-8 h-8"/>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`relative px-5 py-3.5 max-w-[85%] rounded-2xl text-[15px] leading-relaxed 
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
                <span className="text-[10px] text-gray-400 mt-1.5 px-1 font-medium select-none">
                  {msg.role === 'user' ? 'You' : 'Leafy'} • Just now
                </span>
              </div>
            ))}
            
            {loading && (
              <div className="flex items-start">
                <div className="px-5 py-4 bg-white border border-green-100 shadow-sm text-gray-800 rounded-2xl rounded-tl-sm flex items-center gap-2">
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
          <form onSubmit={onSubmit} className="mt-4 pt-4 border-t border-gray-100">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="I want to cook palak paneer..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-full py-3.5 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all shadow-inner"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </form>

        </div>

        {/* Quick Links Nav */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-green-50 py-2 px-3 space-y-1">
          <button onClick={() => navigate('/cart')} className="w-full flex items-center gap-4 px-4 py-3 text-[#6C7570] hover:bg-gray-50 rounded-xl transition cursor-pointer">
            <ShoppingCart size={20} className="text-[#A5ABA8]" />
            <span className="font-medium">Cart Summary</span>
            {getCartCount() > 0 && <span className="ml-auto bg-green-100 text-green-700 font-bold text-xs py-1 px-2.5 rounded-full">{getCartCount()}</span>}
          </button>
          <div className="w-full flex items-center gap-4 px-4 py-3 bg-[#FDECB1]/40 text-amber-900 rounded-xl cursor-default border border-[#F4C137]/30">
            <Bot size={20} className="text-amber-700" />
            <span className="font-bold">AI Assistant</span>
            <div className="ml-auto w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          </div>
          <button onClick={() => navigate('/recipes')} className="w-full flex items-center gap-4 px-4 py-3 text-[#6C7570] hover:bg-gray-50 rounded-xl transition cursor-pointer">
            <FileText size={20} className="text-[#A5ABA8]" />
            <span className="font-medium">Recipes</span>
          </button>
          <button onClick={() => navigate('/my-orders')} className="w-full flex items-center gap-4 px-4 py-3 text-[#6C7570] hover:bg-gray-50 rounded-xl transition cursor-pointer">
            <Truck size={20} className="text-[#A5ABA8]" />
            <span className="font-medium">Track Order</span>
          </button>
        </div>

        <button onClick={() => navigate('/cart')} className="mt-2 w-full py-4 bg-[#1B6F32] hover:bg-[#134D23] text-white rounded-2xl font-bold text-lg transition flex items-center justify-center gap-2 shadow-sm cursor-pointer">
          Checkout Now
        </button>

      </div>
    </div>
  );
};

export default AgentDashboard;
