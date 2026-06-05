import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { AlertCircle, CheckCircle, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Maintenance() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/maintenance/alerts');
      setAlerts(res.data);
    } catch(err) {
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (id) => {
    try {
      await api.put(`/maintenance/alerts/${id}/resolve`);
      toast.success('Alert resolved!');
      fetchAlerts();
    } catch(err) {
      toast.error('Not authorized to resolve');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Maintenance Intelligence <span className="ml-2 text-xs bg-[var(--color-primary)] text-black px-2 py-1 rounded">VoltAI ML</span></h2>
          <p className="text-gray-500">AI-driven predictive maintenance and active fault codes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <div className="p-4 text-[var(--color-primary)]">Loading...</div> : alerts.map(alert => (
          <motion.div 
            key={alert.id}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`glass-panel p-6 border-t-4 ${
              alert.severity === 'CRITICAL' ? 'border-t-red-500 glow-primary shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 
              alert.severity === 'WARNING' ? 'border-t-yellow-500' : 'border-t-green-500'
            }`}
          >
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  {alert.severity === 'CRITICAL' ? <AlertCircle className="text-red-500" /> : <Wrench className="text-yellow-500" />}
                  <h3 className="font-bold text-lg dark:text-white pr-2">{alert.alertType}</h3>
                </div>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300 font-mono">VEH-{alert.vehicleId}</span>
             </div>
             <p className="text-sm text-gray-400 mb-4">{alert.description}</p>
             <div className="flex justify-between items-end border-t border-white/5 pt-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Predicted Failure Date</div>
                  <div className="font-semibold dark:text-gray-300">{alert.predictedFailureDate}</div>
                </div>
                {!alert.resolved ? (
                  <button onClick={() => resolveAlert(alert.id)} className="text-xs flex items-center space-x-1 border border-white/20 hover:border-green-500 px-3 py-1.5 rounded-lg text-gray-300 hover:text-green-400 transition">
                     <CheckCircle size={14} /> <span>Mark Resolved</span>
                  </button>
                ) : (
                  <span className="text-xs text-green-500 font-bold flex items-center"><CheckCircle size={14} className="mr-1"/> Resolved</span>
                )}
             </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
