import React from 'react';
import {
  BrowserRouter,   // ⬅️ ganti ini
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BossTimer from './pages/BossTimer';
import BossTimerOverlay from './pages/BossTimerOverlay';
import ClassTagPlanner from './pages/ClassTagPlanner';
import GearPlanner from './pages/GearPlanner';
import CodesPage from './pages/Codes';
import Settings from './pages/Settings';

import PrivacyPolicy from './pages/PrivacyPolicy';
import About from './pages/About';

// Always lazy load Admin, access is controlled by Route condition
const Admin = React.lazy(() => import('./pages/Admin'));

const App: React.FC = () => {
  // Check localhost at render time to be safe
  const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/overlay/boss-timer/*" element={<BossTimerOverlay />} />

          <Route path="/" element={<Layout />}>
            {/* default "/" → Dashboard */}
            <Route index element={<Dashboard />} />
            <Route path="boss-timer" element={<BossTimer />} />
            <Route path="builds/class-tag" element={<ClassTagPlanner />} />
            <Route path="builds/gear" element={<GearPlanner />} />
            <Route path="codes" element={<CodesPage />} />

            {/* Admin route - ONLY on localhost */}
            {isLocalhost && Admin && (
              <Route path="admin" element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Admin />
                </React.Suspense>
              } />
            )}

            <Route path="settings" element={<Settings />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="about" element={<About />} />

            {/* fallback 404 → Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
};

export default App;
