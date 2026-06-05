import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';
import { Zap, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon for Charging Stations
const chargeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom Icon for Vehicles
const vehicleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


export default function FleetMap() {
  const [vehicles, setVehicles] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // LA Coordinates
  const center = [34.0522, -118.2437];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehRes, statRes] = await Promise.all([
          api.get('/vehicles'),
          api.get('/charging/stations')
        ]);
        setVehicles(vehRes.data);
        setStations(statRes.data);
      } catch (err) {
        console.error("Map data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Live Fleet Map</h2>
          <p className="text-gray-500 dark:text-gray-400">Real-time geospatial tracking of vehicles and charging infrastructure.</p>
        </div>
        <div className="flex space-x-4">
           <div className="flex items-center space-x-2 text-sm text-gray-500">
             <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" className="w-4 h-6" alt="Vehicle"/>
             <span>Vehicles ({vehicles.length})</span>
           </div>
           <div className="flex items-center space-x-2 text-sm text-gray-500">
             <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png" className="w-4 h-6" alt="Station"/>
             <span>Stations ({stations.length})</span>
           </div>
        </div>
      </div>

      <div className="flex-1 glass-panel p-2 overflow-hidden relative shadow-[0_0_30px_rgba(0,0,0,0.3)]">
        {loading ? (
           <div className="absolute inset-0 flex items-center justify-center text-[var(--color-primary)] z-10 bg-black/50 backdrop-blur-sm rounded-xl">
              Loading Geospatial Data...
           </div>
        ) : null}
        
        <div className="w-full h-full rounded-xl overflow-hidden relative z-0">
          <MapContainer center={center} zoom={12} className="w-full h-full">
             <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
             />
             
             {vehicles.map(v => v.latitude && (
                <Marker key={`v-${v.id}`} position={[v.latitude, v.longitude]} icon={vehicleIcon}>
                  <Popup className="custom-popup">
                     <div className="font-bold text-gray-900 border-b pb-1 mb-1">{v.model} (ID: {v.id})</div>
                     <div className="text-sm">Status: <span className="text-blue-600 font-semibold">{v.status}</span></div>
                     <div className="text-sm">Battery: <span className="font-mono">{v.batteryPercent}%</span></div>
                  </Popup>
                </Marker>
             ))}

             {stations.map(s => s.latitude && (
                <Marker key={`s-${s.id}`} position={[s.latitude, s.longitude]} icon={chargeIcon}>
                  <Popup>
                     <div className="font-bold text-gray-900 flex items-center"><Zap size={14} className="mr-1 text-orange-500"/> {s.name}</div>
                     <div className="text-sm">Power: {s.powerKw}kW ({s.connectorType})</div>
                     <div className="text-sm">Available: {s.available ? 'Yes' : 'No'}</div>
                  </Popup>
                </Marker>
             ))}
          </MapContainer>
        </div>
      </div>
    </motion.div>
  );
}
