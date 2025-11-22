import React, { useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
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
    </div>
  );
};

export default Settings;