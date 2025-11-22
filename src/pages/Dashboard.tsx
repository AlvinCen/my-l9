import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BOSSES } from '../data/bosses';
import { formatDuration, formatTime, Timezone, getTimezoneLabel } from '../utils/time';
import { useSettings } from '../contexts/SettingsContext';
import { getOverallNextBossPrediction, getUpcomingBosses } from '../lib/bossPrediction';
import { SEA_SERVERS } from '../data/servers';
import { getLastMaintenance } from '../data/maintenance';
import { useBossReports } from '../hooks/useBossReports';

// --- Helper Components & Icons ---

const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.607 11.955 11.955 0 019 2.607 12.02 12.02 0 00-2.382-9.984z" /></svg>;
const GiftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>;

const FeatureCard: React.FC<{ to: string, icon: React.ReactNode, title: string, description: string }> = ({ to, icon, title, description }) => (
  <Link to={to} className="group block">
    <div className="h-full bg-gray-800/50 border border-gray-700/60 rounded-xl p-6 transition-all duration-300 hover:border-primary-500/80 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-500/10">
      <div className="text-primary-400 mb-3">{icon}</div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </Link>
);


import { useInterval } from '../hooks/useInterval';

const Dashboard: React.FC = () => {
  const { settings } = useSettings();
  const { reports } = useBossReports();
  const [now, setNow] = React.useState(() => new Date());

  useInterval(() => setNow(new Date()), 1000);

  const selectedServer = useMemo(() => {
    const resolvedServerId = settings.selectedServerId || settings.myServerId || SEA_SERVERS[0].id;
    return SEA_SERVERS.find(s => s.id === resolvedServerId) || SEA_SERVERS[0];
  }, [settings.selectedServerId, settings.myServerId]);

  const maintenance = useMemo(() => getLastMaintenance(selectedServer.region), [selectedServer.region]);

  const upcomingBosses = useMemo(() => {
    return getUpcomingBosses(BOSSES, selectedServer, now, maintenance, reports);
  }, [selectedServer, maintenance, reports, now]);

  const nextBossInfo = upcomingBosses[0];
  const secondBossInfo = upcomingBosses[1];

  return (
    <div className="space-y-10">
      {/* Main Content: Next Boss */}
      <div className="grid grid-cols-1 gap-6">
        {/* Next Boss Card */}
        <div className="bg-gray-800/50 border border-primary-500/30 rounded-xl p-6 shadow-lg shadow-primary-500/5 relative overflow-hidden">
          <div className="flex flex-col justify-between h-full min-h-[180px]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-400 mb-2">Next Upcoming Boss</p>
              {nextBossInfo ? (
                <>
                  <h3 className="text-3xl font-bold text-white">{nextBossInfo.boss.name}</h3>
                  <p className="text-5xl font-mono font-bold text-primary-400 my-4">
                    {formatDuration((nextBossInfo.prediction.nextSpawn.getTime() - now.getTime()) / 1000)}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-semibold text-gray-400 mt-8 text-center">No bosses are upcoming.</p>
              )}
            </div>
            {nextBossInfo && (
              <div className="text-xs text-gray-500 flex justify-between">
                <span>{getTimezoneLabel(settings.timezone || 'UTC+8')}: {formatTime(nextBossInfo.prediction.nextSpawn, settings.use24h, settings.timezone || 'UTC+8')}</span>
                <span className="text-gray-600">Server: {formatTime(nextBossInfo.prediction.nextSpawn, true)} (UTC+7)</span>
              </div>
            )}
          </div>
        </div>

        {/* Second Boss Card (Smaller) */}
        {secondBossInfo && (
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Up Next</p>
              <h3 className="text-xl font-bold text-white">{secondBossInfo.boss.name}</h3>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold text-gray-300">
                {formatDuration((secondBossInfo.prediction.nextSpawn.getTime() - now.getTime()) / 1000)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatTime(secondBossInfo.prediction.nextSpawn, settings.use24h, settings.timezone || 'UTC+8')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard to="/boss-timer" icon={<ClockIcon />} title="Boss Timer" description="Track world boss schedules and stream overlay." />
          <FeatureCard to="/builds/class-tag" icon={<UsersIcon />} title="Class Planner" description="Plan class, abilities, and tags." />
          <FeatureCard to="/builds/gear" icon={<ShieldIcon />} title="Gear Planner" description="Build and compare equipment sets." />
          <FeatureCard to="/codes" icon={<GiftIcon />} title="Codes" description="Redeem codes and view rewards." />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;