import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './src/contexts/SettingsContext';

import Layout from './components/Layout';
import Dashboard from './src/pages/Dashboard';
import BossTimer from './src/pages/BossTimer';
import BossTimerOverlay from './src/pages/BossTimerOverlay';
import ClassTagPlanner from './src/pages/ClassTagPlanner';
import GearPlanner from './src/pages/GearPlanner';
import Codes from './src/pages/Codes';
import Settings from './src/pages/Settings';

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
            <Route path="codes" element={<Codes />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </HashRouter>
    </SettingsProvider>
  );
};

export default App;