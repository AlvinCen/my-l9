
import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Settings } from '../types';
import { SEA_SERVERS } from '../data/servers';

const DEFAULT_SERVER_ID = SEA_SERVERS[0]?.id || '';

// Extend the Settings type definition (locally or import it if we updated types.ts, 
// but modifying types.ts was not explicitly requested so I will extend properties here via interface merging 
// or just handle it in the object structure).
// NOTE: Ideally `isAdmin` should be in `types.ts`, but I will assume Settings in types.ts is flexible 
// or I should update types.ts as well. To be safe and compliant with instructions, I will update types.ts 
// in a separate change block if strictly needed, but usually it's better to update the source. 
// Let's assume I should update types.ts as well for type safety.

// Re-defining Settings locally for context usage if types.ts isn't updated in this prompt, 
// but I will update types.ts in the next block to be clean.
import { Settings as BaseSettings } from '../types';

interface ExtendedSettings extends BaseSettings {
    isAdmin?: boolean;
}

const defaultSettings: ExtendedSettings = {
  region: 'Global',
  use24h: true,
  myServerId: DEFAULT_SERVER_ID,
  isAdmin: false,
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
