import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AlertCircle, WifiOff } from 'lucide-react';
import { FullChat } from './components/FullChat';
import { WidgetChat } from './components/WidgetChat';
import { AdminPanel } from './components/AdminPanel';
import { Login } from './components/Login';
import { ApiService } from './services/api';
import { Navigation } from './components/Navigation';

const BackendStatusBanner: React.FC<{ isOffline: boolean }> = ({ isOffline }) => {
  if (!isOffline) return null;
  return (
    <div className="bg-red-500 text-white px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
      <WifiOff size={16} />
      <span>Backend is offline. Please check your connection or configuration.</span>
    </div>
  );
};

// Wrapper to handle query params and layout logic
export const AppContent: React.FC = () => {
  const location = useLocation();
  const [isBackendOffline, setIsBackendOffline] = useState(false);
  
  // Determine if we should show the full layout navigation
  // We hide it for the widget view to keep it clean
  const isWidget = location.pathname === '/widget';
  const isLogin = location.pathname === '/login';

  useEffect(() => {
    // Check for backend URL in query params
    const params = new URLSearchParams(location.search);
    const backendUrl = params.get('backend');
    
    if (backendUrl) {
      ApiService.setBaseUrl(backendUrl);
    }

    // Initial Health Check
    const checkHealth = async () => {
      const isHealthy = await ApiService.checkHealth();
      setIsBackendOffline(!isHealthy);
    };

    checkHealth();
    
    // Poll every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <BackendStatusBanner isOffline={isBackendOffline} />
      
      {!isWidget && !isLogin && <Navigation />}

      <main className={`flex-grow ${isWidget ? 'h-screen' : 'container mx-auto p-4'}`}>
        <Routes>
          <Route path="/" element={<FullChat />} />
          <Route path="/widget" element={<WidgetChat />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}