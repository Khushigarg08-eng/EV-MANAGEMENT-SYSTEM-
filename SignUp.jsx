import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronRight, Loader2 } from 'lucide-react';
import Scene3D from '../components/Scene3D';
import axios from 'axios';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // POST request to backend
      const res = await axios.post('http://localhost:8080/api/auth/signup', formData);
      if (res.status === 200) {
        // Store user in localStorage if needed, then transition
        localStorage.setItem('user', JSON.stringify(res.data));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data || 'Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="w-full h-screen flex relative overflow-hidden"
    >
      {/* 3D Background/Side Context */}
      <div className="absolute inset-0 z-0">
        <Scene3D />
      </div>

      {/* Glassmorphism Panel */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none p-4">
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
          className="bg-black/40 backdrop-blur-3xl border border-[#00F0FF]/30 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.15)] max-w-md w-full pointer-events-auto"
        >
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.7, type: 'spring' }}
              className="w-16 h-16 rounded-full bg-[#00F0FF]/10 flex items-center justify-center border border-[#00F0FF]/40 mb-4 glow-box"
            >
              <Zap className="text-[#00F0FF]" size={32} />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight text-white glow-text">VoltTrack</h1>
            <p className="text-gray-400 mt-2 text-center text-sm">Next-Gen EV Fleet Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#00F0FF] uppercase tracking-wider ml-1">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF]/60 focus:ring-1 focus:ring-[#00F0FF]/60 transition-all placeholder:text-gray-600"
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#00F0FF] uppercase tracking-wider ml-1">Email (Gmail)</label>
              <input 
                type="email" 
                required
                pattern=".*@gmail\.com$"
                title="Please enter a valid Gmail address"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF]/60 focus:ring-1 focus:ring-[#00F0FF]/60 transition-all placeholder:text-gray-600"
                placeholder="johndoe@gmail.com"
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#00F0FF] to-[#0080FF] text-black font-semibold rounded-xl flex items-center justify-center group overflow-hidden relative"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin text-black" size={20} /> : (
                <>
                  <span className="mr-2">Initiate Sequence</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
