
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BossTimer from './pages/BossTimer';
import BossTimerOverlay from './pages/BossTimerOverlay';
import ClassTagPlanner from './pages/ClassTagPlanner';
import GearPlanner from './pages/GearPlanner';
import CodesPage from './pages/CodesPage';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <HashRouter>
        <Routes>
          <Route path="/overlay/boss-timer/*" element={<BossTimerOverlay />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="boss-timer" element={<BossTimer />} />
            <Route path="builds/class-tag" element={<ClassTagPlanner />} />
            <Route path="builds/gear" element={<GearPlanner />} />
            <Route path="codes" element={<CodesPage />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </HashRouter>
    </SettingsProvider>
  );
};

export default App;
