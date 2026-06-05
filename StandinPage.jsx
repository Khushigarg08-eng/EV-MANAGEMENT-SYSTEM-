import { motion } from 'framer-motion';

export default function StandinPage({ title, description }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center">
      <h2 className="text-4xl font-bold dark:text-white mb-4 text-glow">{title}</h2>
      <p className="text-gray-400 max-w-lg mb-8">{description}</p>
      <div className="w-64 h-64 border rounded-full border-[var(--color-primary)]/20 shadow-[0_0_50px_rgba(0,212,255,0.1)] flex items-center justify-center animate-[spin_10s_linear_infinite]">
         <div className="w-48 h-48 border border-dashed rounded-full border-[var(--color-accent)]/50 animate-[spin_15s_linear_reverse_infinite]" />
      </div>
    </motion.div>
  );
}
