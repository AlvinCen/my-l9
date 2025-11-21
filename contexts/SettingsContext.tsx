import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Settings } from '../types';
import { SEA_SERVERS } from '../data/servers';

const DEFAULT_SERVER_ID = SEA_SERVERS[0]?.id || '';

// Extending settings locally to avoid breaking changes in types.ts if not strictly necessary, 
// ensuring the app works even if types.ts wasn't updated by the user.
import { Settings as BaseSettings } from '../types';

interface ExtendedSettings extends BaseSettings {
  isAdmin?: boolean;
}

const defaultSettings: ExtendedSettings = {
  region: 'Global',
  use24h: true,
  myServerId: DEFAULT_SERVER_ID,
  isAdmin: false,
  timezone: 'UTC+8',
};

interface SettingsContextType {
  settings: ExtendedSettings;
  setSettings: (value: ExtendedSettings | ((val: ExtendedSettings) => ExtendedSettings)) => void;
  regions: string[];
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedSettings, setStoredSettings] = useLocalStorage<ExtendedSettings>('ln_settings', defaultSettings);
  const regions = ['Global', 'SEA', 'NA', 'EU'];

  // Ensure we have defaults for new properties
  const settings: ExtendedSettings = {
    ...defaultSettings,
    ...storedSettings,
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings: setStoredSettings, regions }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};