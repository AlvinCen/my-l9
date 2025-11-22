import React, { useMemo } from 'react';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useSettings } from '../contexts/SettingsContext';
import { SEA_SERVERS } from '../data/servers';

const Settings: React.FC = () => {
  const { settings, setSettings } = useSettings();

  const serverGroups = useMemo(() => {
    return SEA_SERVERS.reduce((acc, server) => {
      if (!acc[server.group]) {
        acc[server.group] = [];
      }
      acc[server.group].push(server);
      return acc;
    }, {} as Record<string, typeof SEA_SERVERS>);
  }, []);

  const handleClearData = () => {
    if (
      window.confirm(
        'Are you sure you want to clear ALL local data? This action cannot be undone.'
      )
    ) {
      const keysToKeep = ['lordnine-tools/overlaySettings', 'ln_settings'];
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('ln_') && !keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      // Specific clear for things we want to nuke
      localStorage.removeItem('ln_grind_sessions');
      localStorage.removeItem('ln_class_builds');
      localStorage.removeItem('ln_gear_builds');
      localStorage.removeItem('ln_checklist');
      localStorage.removeItem('ln_boss_reports');
      localStorage.removeItem('LN_BOSS_FAVORITES');
      localStorage.removeItem('ln_code_suggestions');

      alert('User data has been cleared (Settings were preserved). The page will now reload.');
      window.location.reload();
    }
  };

  return (
    <div>
      <PageHeader title="Settings" description="Configure your experience." />

      <Card title="Preferences">
        <div className="space-y-4 max-w-md">
          <div>
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-300"
            >
              Game Region
            </label>
            <select
              id="region"
              value={settings.region}
              onChange={(e) =>
                setSettings({ ...settings, region: e.target.value })
              }
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="SEA">Southeast Asia (SEA)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              This affects which bosses and servers are displayed.
            </p>
          </div>

          <div>
            <label
              htmlFor="myServer"
              className="block text-sm font-medium text-gray-300"
            >
              My Server
            </label>
            <select
              id="myServer"
              value={settings.myServerId || ''}
              onChange={(e) =>
                setSettings({ ...settings, myServerId: e.target.value })
              }
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              {Object.entries(serverGroups).map(([group, servers]) => (
                <optgroup label={group} key={group}>
                  {(servers as typeof SEA_SERVERS).map((server) => (
                    <option key={server.id} value={server.id}>
                      {server.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              This server will be selected by default on the World Boss Timer page.
            </p>
          </div>

          <div className="flex items-center">
            <input
              id="timeformat"
              type="checkbox"
              checked={settings.use24h}
              onChange={(e) =>
                setSettings({ ...settings, use24h: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-500 text-primary-600 bg-gray-800 focus:ring-primary-500"
            />
            <label
              htmlFor="timeformat"
              className="ml-2 block text-sm text-gray-300"
            >
              Use 24-hour time format
            </label>
          </div>

          <div>
            <label
              htmlFor="timezone"
              className="block text-sm font-medium text-gray-300"
            >
              Timezone
            </label>
            <select
              id="timezone"
              value={settings.timezone || 'UTC+8'}
              onChange={(e) =>
                setSettings({ ...settings, timezone: e.target.value as 'UTC+7' | 'UTC+8' | 'UTC+9' })
              }
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="UTC+7">UTC+7 (Bangkok, Jakarta)</option>
              <option value="UTC+8">UTC+8 (Singapore, Manila) - Default</option>
              <option value="UTC+9">UTC+9 (Seoul, Tokyo)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Select your local timezone for accurate time displays.
            </p>
          </div>
        </div>
      </Card>

      <Card title="Admin Mode" className="mt-6 border-t-4 border-t-red-900">
        <div className="max-w-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block font-medium text-gray-200">Enable Admin Tools</label>
              <p className="text-xs text-gray-500">Allows viewing/deleting code suggestions.</p>
            </div>
            <div
              className={`relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in ${settings.isAdmin ? 'bg-primary-600' : 'bg-gray-700'} rounded-full h-6 cursor-pointer`}
              onClick={() => setSettings({ ...settings, isAdmin: !settings.isAdmin })}
            >
              <span
                className={`absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transform transition-transform duration-200 ${settings.isAdmin ? 'translate-x-6 border-primary-600' : 'translate-x-0 border-gray-400'}`}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card title="Data Management" className="mt-6">
        <div className="max-w-md">
          <p className="text-gray-400 mb-4">
            This will remove all your saved builds, grind sessions, and
            checklist progress from this browser.
          </p>
          <Button variant="danger" onClick={handleClearData}>
            Clear Local Data
          </Button>
        </div>
      </Card>

      <Card title="Firebase Debug" className="mt-6 border-t-4 border-t-blue-500">
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Use this to test the connection to Firestore.
          </p>
          <div className="bg-gray-900 p-3 rounded font-mono text-xs text-green-400 overflow-x-auto">
            Config Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID || 'l9-companion'}
          </div>
          <div className="flex space-x-2">
            <Button onClick={async () => {
              try {
                const { collection, addDoc, getDocs, query, limit } = await import('firebase/firestore');
                const { db } = await import('../../firebase');

                console.log("Starting manual test...");

                const timeout = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error("Operation timed out after 10s. Check network/firewall.")), 10000)
                );

                const docRef = await Promise.race([
                  addDoc(collection(db, 'debug_test'), {
                    timestamp: new Date().toISOString(),
                    test: true
                  }),
                  timeout
                ]) as any;

                alert(`Write Success! ID: ${docRef.id}`);

                const q = query(collection(db, 'debug_test'), limit(5));
                const snapshot = await getDocs(q);
                const count = snapshot.size;
                alert(`Read Success! Found ${count} docs in 'debug_test'.`);

              } catch (e: any) {
                console.error("Firebase Test Error:", e);
                alert(`Error: ${e.message}`);
              }
            }}>
              Test Read/Write
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;