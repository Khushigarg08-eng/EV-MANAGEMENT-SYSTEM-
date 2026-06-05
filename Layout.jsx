import { useState, useContext } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Map, Car, Zap, Users, Wrench, 
  BarChart3, FileText, Settings, Menu, X, LogOut, Sun, Moon 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Fleet Map', path: '/map', icon: Map },
    { name: 'Vehicles', path: '/vehicles', icon: Car },
    { name: 'Charging', path: '/charging', icon: Zap },
    { name: 'Drivers', path: '/drivers', icon: Users },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[var(--color-bg-dark)]">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 glass-panel border-r-0 md:border-r border-[var(--color-border-dark)] flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/10 dark:border-[var(--color-border-dark)]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center border border-[var(--color-primary)]/50 glow-primary">
              <Zap className="text-[var(--color-primary)]" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-glow">VoltTrack</span>
          </div>
          <button className="md:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => 
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <link.icon size={20} />
              <span className="font-medium">{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 dark:border-[var(--color-border-dark)]">
          <button 
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-gray-600 dark:text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 glass-panel border-b-0 border-x-0 !rounded-none flex items-center justify-between px-6 z-10">
          <div className="flex items-center">
            <button 
              className="mr-4 md:hidden text-gray-600 dark:text-gray-300"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold hidden sm:block">
              {/* Pathname based title could go here */}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition">
              {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-300 dark:border-white/10">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold">{user?.name}</span>
                <span className="text-xs text-[var(--color-primary)] font-medium uppercase tracking-wider">{user?.role}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold opacity-90 shadow-lg">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-primary)_0%,_transparent_20%)] opacity-5 pointer-events-none" />
          <div className="w-full h-full p-4 md:p-8 z-10 relative">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
