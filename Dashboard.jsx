import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Zap, Battery, AlertTriangle, IndianRupee, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';

const COLORS = ['#00D4FF', '#7B2FBE', '#10B981', '#EF4444']; // Cyan, Purple, Green, Red

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for charts while backend builds up
  const batteryData = [
    { name: 'Mon', avg: 85 }, { name: 'Tue', avg: 82 }, { name: 'Wed', avg: 76 },
    { name: 'Thu', avg: 71 }, { name: 'Fri', avg: 88 }, { name: 'Sat', avg: 92 }, { name: 'Sun', avg: 90 }
  ];
  
  const consumptionData = [
    { name: 'EV-01', kwh: 120 }, { name: 'EV-02', kwh: 90 }, { name: 'EV-03', kwh: 150 },
    { name: 'EV-04', kwh: 60 }, { name: 'EV-05', kwh: 110 }, { name: 'EV-06', kwh: 80 }
  ];

  const distributionData = [
    { name: 'Active', value: 4 }, { name: 'Charging', value: 1 }, { name: 'Idle', value: 1 }
  ];

  useEffect(() => {
    fetchSummary();
    setupWebSocket();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get('/analytics/summary');
      setSummary(res.data);
    } catch(err) {
      console.error(err);
      toast.error("Failed to load summary");
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    const socket = new SockJS('http://localhost:8080/ws/telemetry');
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {}; // quiet
    stompClient.connect({}, (frame) => {
      stompClient.subscribe('/topic/telemetry', (message) => {
        const data = JSON.parse(message.body);
        // You could update state here with latest telemetry
        // console.log("Live telemetry:", data);
      });
    }, (error) => {
        console.error("WS Error:", error);
    });
    return () => stompClient.disconnect();
  };

  if (loading) return <div className="p-8 animate-pulse text-[var(--color-primary)]">Initializing Telemetry...</div>;

  const kpis = [
    { title: 'Total Vehicles', value: summary?.totalVehicles || 6, icon: Car, color: 'text-blue-400' },
    { title: 'Active Now', value: summary?.activeNow || 4, icon: TrendingUp, color: 'text-green-400' },
    { title: 'Avg Battery %', value: summary?.avgBatteryPercent ? Math.round(summary.avgBatteryPercent) + '%' : '72%', icon: Battery, color: 'text-[var(--color-primary)]' },
    { title: 'Charging', value: summary?.chargingCount || 1, icon: Zap, color: 'text-yellow-400' },
    { title: 'Critical Alerts', value: 2, icon: AlertTriangle, color: 'text-red-400' },
    { title: 'Energy Cost MTD', value: '₹14,250', icon: IndianRupee, color: 'text-[var(--color-accent)]' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Live Ticker */}
      <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg p-3 mb-6 flex items-center shadow-[0_0_15px_rgba(0,212,255,0.1)]">
        <div className="flex items-center space-x-2 text-[var(--color-primary)] font-semibold text-sm">
          <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-ping" />
          <span>LIVE TELEMETRY:</span>
        </div>
        <div className="ml-4 overflow-hidden w-full relative">
           <div className="whitespace-nowrap animate-[marquee_15s_linear_infinite] text-sm dark:text-gray-300">
             Vehicle 3 Battery Critical (15%) • Vehicle 4 charging complete at Downtown Station • Route optimization active • CO2 saved today: 42kg
           </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {kpis.map((kpi, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
            className="glass-panel p-4 flex flex-col justify-between hover:border-[var(--color-primary)]/40 transition-colors"
          >
             <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">{kpi.title}</span>
                <kpi.icon size={16} className={kpi.color} />
             </div>
             <div className="text-2xl font-bold dark:text-white">{kpi.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Line Chart */}
        <div className="glass-panel p-6 xl:col-span-2">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Fleet Average Battery (7 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={batteryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fill: '#888'}} />
                <YAxis stroke="#666" tick={{fill: '#888'}} />
                <RechartsTooltip contentStyle={{backgroundColor: '#111', borderColor: '#333'}} />
                <Line type="monotone" dataKey="avg" stroke="var(--color-primary)" strokeWidth={3} dot={{r: 4, fill: 'var(--color-primary)'}} activeDot={{r: 6, glow: '0 0 10px #00D4FF'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Fleet Status</h3>
          <div className="h-72 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{backgroundColor: '#111', borderColor: '#333'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Required style constraint helper for marquee */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
      `}} />
    </motion.div>
  );
}
