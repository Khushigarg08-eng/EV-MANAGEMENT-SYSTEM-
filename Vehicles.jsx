import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Battery, Car, Info, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/vehicles').then(res => {
      setVehicles(res.data);
      setLoading(false);
    }).catch(err => {
      toast.error('Failed to load vehicles');
      setLoading(false);
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Fleet Vehicles</h2>
          <p className="text-gray-500">Manage all registered electric assets.</p>
        </div>
        <button className="bg-[var(--color-primary)] text-black px-4 py-2 rounded-lg font-semibold flex items-center shadow-[0_0_15px_rgba(0,212,255,0.3)] hover:scale-105 transition-transform">
          <Plus size={18} className="mr-2" /> Add Vehicle
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        {loading ? (
           <div className="p-8 text-center text-[var(--color-primary)]">Loading Assets...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-500 text-sm uppercase">
                <th className="py-4 px-6 font-semibold">ID / Model</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Battery</th>
                <th className="py-4 px-6 font-semibold">Condition</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.05 }}
                  key={v.id} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[var(--color-primary)]/50 transition-colors">
                        <Car size={18} className="text-gray-400 group-hover:text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{v.model}</div>
                        <div className="text-xs text-gray-500">Year: {v.manufactureYear}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      v.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                      v.status === 'CHARGING' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20' :
                      v.status === 'MAINTENANCE' ? 'bg-red-500/20 text-red-500 border border-red-500/20' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/20'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                       <Battery size={16} className={v.batteryPercent < 20 ? 'text-red-500' : 'text-green-500'} />
                       <span className="font-mono">{v.batteryPercent}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-400">{v.conditionStatus}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition">
                      <Info size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
