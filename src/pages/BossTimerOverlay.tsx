import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { BOSSES } from '../data/bosses';
import { useInterval } from '../hooks/useInterval';
import { formatDuration } from '../utils/time';
import { getOverallNextBossPrediction } from '../lib/bossPrediction';
import { useMaintenance } from '../hooks/useMaintenance';
import { SEA_SERVERS } from '../data/servers';
import { useBossReports } from '../hooks/useBossReports';
import { useSettings } from '../contexts/SettingsContext';
import { Boss, BossPrediction, GameServer } from '../types';
import { useNavigate } from 'react-router-dom';

// The visual component, exported for use in Settings preview
export const OverlayCard: React.FC<{
  server: GameServer | undefined;
  prediction: { boss: Boss; prediction: BossPrediction } | null;
  now: Date;
  showRegion: boolean;
  lang: string; // lang is there for future use
}> = ({ server, prediction, now, showRegion }) => {
  if (!server) {
    return (
      <div className="w-full max-w-lg bg-slate-900/90 border border-red-500/30 rounded-lg shadow-xl flex items-center p-4">
        <p className="text-red-300">Error: Server not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-slate-900/90 border border-primary-500/30 rounded-lg shadow-xl flex items-center p-4">
      {showRegion && (
        <div className="pr-4 mr-4 border-r border-slate-700/60 text-center flex-shrink-0">
          <p className="text-xs uppercase text-slate-400 tracking-wider">{server.region}</p>
          <p className="text-lg font-bold text-primary-400">{server.name}</p>
        </div>
      )}
      <div className="flex-grow min-w-0">
        {prediction ? (
          <div>
            <p className="text-sm text-slate-300 truncate">Next: <span className="font-bold text-white">{prediction.boss.name}</span></p>
            <p className="text-4xl font-mono font-bold text-primary-300 mt-1">
              {formatDuration((prediction.prediction.nextSpawn.getTime() - now.getTime()) / 1000)}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="font-semibold text-slate-300">No upcoming bosses found.</p>
          </div>
        )}
      </div>
    </div>
  );
};


const BossTimerOverlay: React.FC = () => {
  const location = useLocation();
  const { settings } = useSettings();
  const { reports } = useBossReports();
  const { maintenanceRecords } = useMaintenance();
  const navigate = useNavigate();


  const { serverId, showRegion, lang } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      serverId: params.get('serverId') || settings.selectedServerId || settings.myServerId || SEA_SERVERS[0].id,
      showRegion: params.get('showRegion') !== '0', // default to true
      lang: params.get('lang') || 'en',
    };
  }, [location.search, settings.selectedServerId]);

  const selectedServer = useMemo(
    () => SEA_SERVERS.find((s) => s.id === serverId),
    [serverId]
  );

  const maintenance = useMemo(() => {
    if (!selectedServer) return undefined;
    const regionMaintenance = maintenanceRecords
      .filter(m => m.region === selectedServer.region)
      .sort((a, b) => new Date(b.lastCompletedAt).getTime() - new Date(a.lastCompletedAt).getTime());
    return regionMaintenance[0] ? {
      region: regionMaintenance[0].region,
      lastCompletedAt: regionMaintenance[0].lastCompletedAt
    } : undefined;
  }, [maintenanceRecords, selectedServer]);


  const [now, setNow] = useState(() => new Date());
  useInterval(() => setNow(new Date()), 1000);

  const nextBossInfo = useMemo(() => {
    if (!selectedServer || !maintenance) return null;
    return getOverallNextBossPrediction(BOSSES, selectedServer, now, maintenance, reports);
  }, [selectedServer, now, maintenance, reports]);

  return (
    <div className="min-h-screen bg-transparent text-slate-50 flex items-center justify-center p-4 font-sans">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/boss-timer')}
        className="absolute top-4 left-4 z-10 px-3 py-1 rounded-md text-xs font-semibold
                   bg-slate-800/80 border border-slate-600 hover:bg-slate-700
                   shadow-sm shadow-slate-900/50"
      >
        ← Back
      </button>
      <OverlayCard
        server={selectedServer}
        prediction={nextBossInfo}
        now={now}
        showRegion={showRegion}
        lang={lang}
      />
    </div>
  );
};

export default BossTimerOverlay;
