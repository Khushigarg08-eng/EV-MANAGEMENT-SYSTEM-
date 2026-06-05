import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Cpu, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function VoltAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Initializing VoltAI core protocols. How can I assist with your fleet today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { 
        message: userMsg,
        context: "You are VoltAI, an advanced AI EV Fleet Manager. Give short, technical, and precise answers about battery health, maintenance, and fleet status." 
      });
      
      const aiResponse = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to parse AI response. Neural link disrupted.";
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error connecting to VoltAI neural core. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button 
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--color-primary)] text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] transition-all z-50 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Cpu size={28} className="drop-shadow-md" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[var(--color-primary)] shadow-sm animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] glass-panel bg-black/60 shadow-2xl flex flex-col z-50 border border-[var(--color-primary)]/30 overflow-hidden"
          >
            <div className="p-4 bg-[var(--color-primary)]/10 border-b border-[var(--color-primary)]/20 flex justify-between items-center bg-gradient-to-r from-[var(--color-primary)]/20 to-transparent">
              <div className="flex items-center space-x-2">
                <Cpu className="text-[var(--color-primary)]" size={20} />
                <span className="font-bold text-white text-glow">VoltAI Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl p-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-[var(--color-primary)] text-black font-medium tracking-tight rounded-tr-none' 
                      : 'bg-white/10 text-gray-200 border border-white/10 rounded-tl-none leading-relaxed'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                   <div className="bg-white/10 border border-white/10 rounded-xl p-3 rounded-tl-none flex space-x-2 items-center">
                     <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" />
                     <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce delay-75" />
                     <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce delay-150" />
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-[var(--color-primary)]/20 bg-black/40 flex items-center space-x-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask VoltAI..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/50 text-sm placeholder:text-gray-500"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || loading}
                className="p-2.5 bg-[var(--color-primary)] text-black rounded-lg disabled:opacity-50 hover:bg-[var(--color-primary)]/90 transition-colors shadow-lg"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
