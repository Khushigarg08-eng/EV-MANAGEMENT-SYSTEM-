import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FleetMap from './pages/FleetMap';
import Vehicles from './pages/Vehicles';
import ChargingSessions from './pages/ChargingSessions';
import Drivers from './pages/Drivers';
import Maintenance from './pages/Maintenance';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import VoltAI from './components/VoltAI';

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0A0A0F] text-gray-900 dark:text-white transition-colors duration-300">
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<FleetMap />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/charging" element={<ChargingSessions />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
      
      {/* Floating VoltAI widget accessible globally if logged in */}
      {user && <VoltAI />}
    </div>
  );
}

export default App;
