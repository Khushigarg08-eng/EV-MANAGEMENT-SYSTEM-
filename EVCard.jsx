import { motion } from 'framer-motion';
import { Battery, BatteryFull, BatteryMedium, BatteryLow, Car, MapPin, Wrench } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function EVCard({ vehicle, index }) {
  const getBatteryIcon = (percentage) => {
    if (percentage > 80) return <BatteryFull className="text-green-400" size={24} />;
    if (percentage > 40) return <BatteryMedium className="text-yellow-400" size={24} />;
    return <BatteryLow className="text-red-400" size={24} />;
  };

  const getBatteryColor = (percentage) => {
    if (percentage > 80) return 'bg-green-400';
    if (percentage > 40) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const conditionColor = 
    vehicle.condition === 'Excellent' ? 'text-green-400 border-green-400/30 bg-green-400/10' :
    vehicle.condition === 'Good' ? 'text-blue-400 border-blue-400/30 bg-blue-400/10' :
    'text-red-400 border-red-400/30 bg-red-400/10';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
      whileHover={{ 
        y: -10,
        boxShadow: "0 20px 40px -10px rgba(0,240,255,0.15)",
        borderColor: "rgba(0,240,255,0.4)" 
      }}
      className="bg-[#151518] border border-white/5 rounded-2xl p-6 relative overflow-hidden group transition-colors duration-300"
    >
      {/* Glossy overlay effect for 3D feel */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex justify-between items-start mb-6 align-top">
        <div>
          <div className="flex items-center space-x-2 text-gray-400 text-sm mb-1">
            <Car size={16} />
            <span>ID: {String(vehicle.id).padStart(4, '0')}</span>
          </div>
          <h2 className="text-2xl font-bold text-white group-hover:text-[#00F0FF] transition-colors">{vehicle.vehicleName}</h2>
          <p className="text-gray-500">{vehicle.vehicleModel}</p>
        </div>
        <div className="flex flex-col items-center">
          {getBatteryIcon(vehicle.batteryPercentage)}
          <span className="text-xl font-bold mt-1 text-white">{vehicle.batteryPercentage}%</span>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        {/* Battery Progress Bar */}
        <div className="w-full bg-black/50 rounded-full h-2.5 outline outline-1 outline-white/10 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${vehicle.batteryPercentage}%` }}
            transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
            className={cn("h-2.5 rounded-full filter drop-shadow-[0_0_5px_currentColor]", getBatteryColor(vehicle.batteryPercentage))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-black/30 rounded-xl p-3 border border-white/5 group-hover:border-white/10 transition">
          <div className="flex items-center space-x-2 mb-1">
            <Wrench size={14} className="text-gray-400" />
            <span className="text-xs text-gray-400 uppercase">Condition</span>
          </div>
          <span className={cn("text-sm font-semibold px-2 py-0.5 rounded-full border", conditionColor)}>
            {vehicle.condition}
          </span>
        </div>

        <div className="bg-black/30 rounded-xl p-3 border border-white/5 group-hover:border-white/10 transition">
          <div className="flex items-center space-x-2 mb-1">
            <MapPin size={14} className="text-gray-400" />
            <span className="text-xs text-gray-400 uppercase">Nearest Station</span>
          </div>
          <span className="text-sm font-medium text-white truncate block" title={vehicle.nearestChargingStation}>
            {vehicle.nearestChargingStation}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
