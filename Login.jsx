import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Zap, ChevronRight, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: 'admin@volttrack.com', password: 'password123' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Authentication successful');
    } catch (err) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex relative overflow-hidden bg-[var(--color-bg-dark)]">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[var(--color-accent)]/5 blur-3xl" />

      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="glass-panel p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-md w-full"
        >
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, type: 'spring' }}
              className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/40 mb-4 glow-primary"
            >
              <Zap className="text-[var(--color-primary)]" size={32} />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight text-white text-glow">VoltTrack</h1>
            <p className="text-gray-400 mt-2 text-center text-sm">Enterprise Fleet Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-primary)] uppercase tracking-wider ml-1">Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)]/60 focus:ring-1 focus:ring-[var(--color-primary)]/60 transition-all placeholder:text-gray-600"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-primary)] uppercase tracking-wider ml-1">Password</label>
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)]/60 focus:ring-1 focus:ring-[var(--color-primary)]/60 transition-all placeholder:text-gray-600"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 px-4 bg-[var(--color-primary)] text-black font-bold rounded-xl flex items-center justify-center group relative glow-primary overflow-hidden"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
              {loading ? <Loader2 className="animate-spin text-black" size={20} /> : (
                <>
                  <span className="mr-2">Authorize Access</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex gap-2 text-xs text-gray-400 justify-center">
             <button onClick={() => setFormData({email: 'admin@volttrack.com', password: 'password123'})} className="hover:text-white transition">Admin</button>
             <span>|</span>
             <button onClick={() => setFormData({email: 'manager@volttrack.com', password: 'password123'})} className="hover:text-white transition">Manager</button>
             <span>|</span>
             <button onClick={() => setFormData({email: 'john@volttrack.com', password: 'password123'})} className="hover:text-white transition">Driver</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
