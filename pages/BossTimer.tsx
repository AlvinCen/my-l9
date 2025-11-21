
import React, { useState, useMemo, useEffect, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import { BOSSES, WORLD_BOSSES, FIELD_BOSSES } from '../data/bosses';
import { Boss, BossPrediction, BossReport, GameServer } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { SEA_SERVERS } from '../data/servers';
import { getLastMaintenance } from '../data/maintenance';
import { getBossPrediction, getOverallNextBossPrediction } from '../lib/bossPrediction';
import { useInterval } from '../hooks/useInterval';
import { formatDuration, formatTime, formatRelativeTime, Timezone, getTimezoneLabel } from '../utils/time';
import { useBossReports } from '../hooks/useBossReports';
import { useBossFavorites } from '../hooks/useBossFavorites';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Card from '../components/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  buildOverlayUrl,
  DEFAULT_OVERLAY_SETTINGS,
  OverlaySettings,
} from '../lib/overlayUrl';
import { OverlayCard } from './BossTimerOverlay';

type BossFilter = 'ALL' | 'FIELD' | 'DESTROYER' | 'FAVORITES';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// --- NOTIFICATION SETTINGS ---
type BossTimerNotificationSettings = {
  enabled: boolean;
  onlyGreaterBosses: boolean;
  onBossSpawn: boolean;
  minutesBefore: number[];
  volume: number;
};

const ALERT_MINUTE_OPTIONS = [1, 3, 5, 10, 15, 30];

const DEFAULT_NOTIFICATION_SETTINGS: BossTimerNotificationSettings = {
  enabled: true,
  onlyGreaterBosses: false,
  onBossSpawn: true,
  minutesBefore: [3, 5],
  volume: 0.8,
};

const NOTIF_STORAGE_KEY = 'lordnine-tools/bossTimerNotifications';

const useBossTimerNotificationSettings = () => {
  const [settings, setSettings] = useState<BossTimerNotificationSettings>(() => {
    try {
      const stored = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_NOTIFICATION_SETTINGS,
          ...parsed,
          volume: Math.max(
            0,
            Math.min(1, parsed.volume ?? DEFAULT_NOTIFICATION_SETTINGS.volume)
          ),
          minutesBefore: Array.isArray(parsed.minutesBefore)
            ? parsed.minutesBefore
            : DEFAULT_NOTIFICATION_SETTINGS.minutesBefore,
        };
      }
    } catch (e) {
      console.error('Failed to parse notification settings from localStorage', e);
    }
    return DEFAULT_NOTIFICATION_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save notification settings to localStorage', e);
    }
  }, [settings]);

  return { notifSettings: settings, setNotifSettings: setSettings };
};

const playNotificationSound = (volume: number) => {
  if (typeof window === 'undefined') return;
  try {
    const audio = new Audio('/sounds/alert.mp3');
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.play().catch(() => { });
  } catch (error) {
    console.error('Failed to play notification sound', error);
  }
};

function getScheduleSummary(boss: Boss): string[] {
  const schedules = boss.schedules ?? [];
  if (!schedules.length) return [];

  const byTime = new Map<string, Set<number>>();

  for (const s of schedules) {
    if (!byTime.has(s.time)) {
      byTime.set(s.time, new Set());
    }
    byTime.get(s.time)!.add(s.dayOfWeek);
  }

  const summaries: string[] = [];

  for (const [time, daysSet] of byTime.entries()) {
    const days = Array.from(daysSet).sort();

    if (days.length === 7) {
      summaries.push(`Daily ${time}`);
    } else {
      const labels = days.map((d) => DAY_LABELS[d]);
      summaries.push(`${labels.join('/')} ${time}`);
    }
  }

  return summaries.sort();
}

const getStatus = (
  nextSpawn: Date | null,
  now: Date
): { label: string; color: string; isSoon: boolean } => {
  if (!nextSpawn || nextSpawn < now)
    return {
      label: 'SPAWNED',
      color: 'bg-red-500/20 text-red-300',
      isSoon: false,
    };
  const diffMinutes = (nextSpawn.getTime() - now.getTime()) / (1000 * 60);

  if (diffMinutes < 60)
    return {
      label: 'SOON',
      color: 'bg-emerald-500/20 text-emerald-300',
      isSoon: true,
    };
  if (diffMinutes < 6 * 60)
    return {
      label: 'UPCOMING',
      color: 'bg-sky-500/20 text-sky-300',
      isSoon: false,
    };
  return {
    label: 'LATER',
    color: 'bg-slate-600/30 text-slate-200',
    isSoon: false,
  };
};

const formatToDateTimeLocal = (date: Date): string => {
  const tzoffset = new Date().getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - tzoffset)
    .toISOString()
    .slice(0, -1);
  return localISOTime.substring(0, 16);
};

// --- Helper Components ---

const StarIcon: React.FC<{ filled: boolean } & React.SVGProps<SVGSVGElement>> = ({
  filled,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

const PredictionSourceBadge: React.FC<{
  prediction: BossPrediction | null;
  reportsCount: number;
}> = ({ prediction, reportsCount }) => {
  if (!prediction) return null;

  const sourceInfo =
    {
      FIXED_SCHEDULE: {
        text: 'Fixed Schedule',
        style: 'bg-sky-500/15 text-sky-200 border border-sky-500/30',
      },
      MAINTENANCE_BASED: {
        text: 'After Maintenance',
        style: 'bg-amber-500/10 text-amber-200 border border-amber-500/30',
      },
      COMMUNITY_REPORT: {
        text: `Community (${reportsCount})`,
        style:
          'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30',
      },
    }[prediction.source];

  if (!sourceInfo) return null;

  return (
    <span
      className={`inline-block text-xs font-semibold px-2 py-1 rounded-full border ${sourceInfo.style}`}
    >
      {sourceInfo.text}
    </span>
  );
};

// --- Modals ---

const NotificationSettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  settings: BossTimerNotificationSettings;
  onChange: (next: BossTimerNotificationSettings) => void;
}> = ({ isOpen, onClose, settings, onChange }) => {
  if (!isOpen) return null;

  const update = (patch: Partial<BossTimerNotificationSettings>) => {
    onChange({ ...settings, ...patch });
  };

  const handleToggleMinute = (minute: number) => {
    const nextMinutes = settings.minutesBefore.includes(minute)
      ? settings.minutesBefore.filter((m) => m !== minute)
      : [...settings.minutesBefore, minute].sort((a, b) => a - b);
    update({ minutesBefore: nextMinutes });
  };

  const ToggleSwitch: React.FC<{ on: boolean }> = ({ on }) => (
    <span
      className={`px-3 py-1 text-xs font-bold rounded-full ${on ? 'bg-primary-600 text-white' : 'bg-gray-600 text-gray-300'
        }`}
    >
      {on ? 'ON' : 'OFF'}
    </span>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Notification Settings">
      <div className="space-y-6">
        {/* Volume */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="volume" className="font-semibold text-gray-200">
              Volume
            </label>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => playNotificationSound(settings.volume)}
            >
              Test
            </Button>
          </div>
          <input
            id="volume"
            type="range"
            min="0"
            max="100"
            value={settings.volume * 100}
            onChange={(e) =>
              update({ volume: parseInt(e.target.value, 10) / 100 })
            }
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <div
            onClick={() => update({ enabled: !settings.enabled })}
            className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700"
          >
            <div>
              <p className="font-semibold">Master Alerts</p>
              <p className="text-xs text-gray-400">
                Enable or disable all boss alerts.
              </p>
            </div>
            <ToggleSwitch on={settings.enabled} />
          </div>
          <div
            onClick={() =>
              update({ onlyGreaterBosses: !settings.onlyGreaterBosses })
            }
            className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700"
          >
            <div>
              <p className="font-semibold">Greater Bosses Only</p>
              <p className="text-xs text-gray-400">
                Alerts only for World / Destroyer bosses.
              </p>
            </div>
            <ToggleSwitch on={settings.onlyGreaterBosses} />
          </div>
          <div
            onClick={() => update({ onBossSpawn: !settings.onBossSpawn })}
            className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700"
          >
            <div>
              <p className="font-semibold">On Boss Spawn</p>
              <p className="text-xs text-gray-400">
                Play an alert exactly when the boss spawns.
              </p>
            </div>
            <ToggleSwitch on={settings.onBossSpawn} />
          </div>
        </div>

        {/* Minute Alerts */}
        <div>
          <p className="font-semibold mb-2">Alerts before spawn</p>
          <div className="grid grid-cols-2 gap-2">
            {ALERT_MINUTE_OPTIONS.map((minute) => (
              <button
                key={minute}
                onClick={() => handleToggleMinute(minute)}
                className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700"
              >
                <span>
                  {minute} minute{minute > 1 ? 's' : ''} before
                </span>
                <ToggleSwitch
                  on={settings.minutesBefore.includes(minute)}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const ReportKillModal: React.FC<{
  boss: Boss | null;
  server: GameServer;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventTime: Date) => void;
}> = ({ boss, server, isOpen, onClose, onSubmit }) => {
  const [killTime, setKillTime] = useState(
    formatToDateTimeLocal(new Date())
  );

  if (!isOpen || !boss) return null;

  const handleSubmit = () => {
    onSubmit(new Date(killTime));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Report Kill - ${boss.name}`}
    >
      <div className="space-y-4">
        <p className="text-gray-400">
          Report the time this boss died on{' '}
          <span className="font-bold text-primary-400">{server.name}</span>.
          Predictions for this server will be updated.
        </p>
        <div>
          <label
            htmlFor="killTime"
            className="block text-sm font-medium text-gray-300"
          >
            Kill Time (Your Local Time)
          </label>
          <input
            type="datetime-local"
            id="killTime"
            value={killTime}
            onChange={(e) => setKillTime(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Report</Button>
        </div>
      </div>
    </Modal>
  );
};

const ViewReportsModal: React.FC<{
  boss: Boss | null;
  reports: BossReport[];
  isOpen: boolean;
  onClose: () => void;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  use24h: boolean;
}> = ({ boss, reports, isOpen, onClose, onUpvote, onDownvote, use24h }) => {
  if (!isOpen || !boss) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Recent Reports - ${boss.name}`}
    >
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {reports.slice(0, 10).map((report) => (
          <div
            key={report.id}
            className="bg-gray-700/50 p-3 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {formatTime(new Date(report.eventTime), use24h)} -{' '}
                <span className="text-sm text-gray-400">
                  {new Date(report.eventTime).toLocaleDateString()}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                Reported {formatRelativeTime(new Date(report.createdAt))}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-300">
                <span className="text-green-400">
                  +{report.upvotes}
                </span>{' '}
                /{' '}
                <span className="text-red-400">
                  -{report.downvotes}
                </span>
              </span>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onUpvote(report.id)}
                  aria-label="Upvote"
                >
                  👍
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onDownvote(report.id)}
                  aria-label="Downvote"
                >
                  👎
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

const BossTimer: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<BossFilter>('ALL');
  const [now, setNow] = useState(() => new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlySoon, setShowOnlySoon] = useState(false);

  const { reports, getReportsFor, addReport, upvote, downvote } =
    useBossReports();
  const { favorites, isFavorite, toggleFavorite } = useBossFavorites();
  const [reportModalState, setReportModalState] = useState<{
    isOpen: boolean;
    boss: Boss | null;
  }>({ isOpen: false, boss: null });
  const [viewReportsModalState, setViewReportsModalState] = useState<{
    isOpen: boolean;
    boss: Boss | null;
  }>({ isOpen: false, boss: null });

  const { notifSettings, setNotifSettings } =
    useBossTimerNotificationSettings();
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const firedNotificationsRef = useRef<Record<string, boolean>>({});

  const [overlaySettings, setOverlaySettings] =
    useLocalStorage<OverlaySettings>('lordnine-tools/overlaySettings', {
      ...DEFAULT_OVERLAY_SETTINGS,
      serverId: settings.selectedServerId || SEA_SERVERS[0].id,
    });
  const [overlayCopied, setOverlayCopied] = useState(false);

  useInterval(() => setNow(new Date()), 1000);

  // Use selectedServerId if available (user clicked a server on this page previously)
  // Fallback to myServerId (from Settings)
  // Fallback to first SEA server
  const resolvedServerId =
    settings.selectedServerId || settings.myServerId || SEA_SERVERS[0].id;

  const selectedServer = useMemo(
    () =>
      SEA_SERVERS.find((s) => s.id === resolvedServerId) ||
      SEA_SERVERS[0],
    [resolvedServerId]
  );

  const maintenance = useMemo(
    () => getLastMaintenance(selectedServer.region),
    [selectedServer.region]
  );

  // Overlay URL (path for router) + full URL for OBS
  const overlayPath = useMemo(
    () => buildOverlayUrl(overlaySettings),
    [overlaySettings]
  );

  const overlayFullUrl = useMemo(() => {
    if (typeof window === 'undefined') return overlayPath;
    const [base] = window.location.href.split('#');
    return `${base}#${overlayPath}`;
  }, [overlayPath]);

  const handleCopyOverlayUrl = () => {
    if (!overlayFullUrl) return;
    navigator.clipboard
      .writeText(overlayFullUrl)
      .then(() => {
        setOverlayCopied(true);
        setTimeout(() => setOverlayCopied(false), 2000);
      })
      .catch(() => { });
  };

  const handleOpenOverlay = () => {
    if (!overlayFullUrl) return;
    const proto = window.location.protocol;
    if (proto === 'file:' || proto === 'blob:') {
      window.location.href = overlayFullUrl;
    } else {
      window.open(overlayFullUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Overlay preview (uses its own selected server)
  const overlayPreviewServer = useMemo(
    () => SEA_SERVERS.find((s) => s.id === overlaySettings.serverId) || null,
    [overlaySettings.serverId]
  );

  const overlayPreviewMaintenance = useMemo(
    () =>
      overlayPreviewServer
        ? getLastMaintenance(overlayPreviewServer.region)
        : undefined,
    [overlayPreviewServer]
  );

  const overlayPreviewNextBoss = useMemo(() => {
    if (!overlayPreviewServer || !overlayPreviewMaintenance) return null;
    return getOverallNextBossPrediction(
      BOSSES,
      overlayPreviewServer,
      now,
      overlayPreviewMaintenance,
      reports
    );
  }, [overlayPreviewServer, overlayPreviewMaintenance, now, reports]);

  const serverGroups = useMemo(() => {
    return SEA_SERVERS.reduce((acc, server) => {
      if (!acc[server.group]) {
        acc[server.group] = [];
      }
      acc[server.group].push(server);
      return acc;
    }, {} as Record<string, typeof SEA_SERVERS>);
  }, []);

  useEffect(() => {
    if (!notifSettings.enabled) return;
    if (
      notifSettings.minutesBefore.length === 0 &&
      !notifSettings.onBossSpawn
    )
      return;

    const nowMs = now.getTime();

    BOSSES.forEach((boss) => {
      if (notifSettings.onlyGreaterBosses && boss.type === 'FIELD') return;

      const prediction = getBossPrediction({
        boss,
        server: selectedServer,
        now,
        maintenance,
        reports,
      });
      if (!prediction) return;

      const spawnMs = prediction.nextSpawn.getTime();
      const diffSeconds = (spawnMs - nowMs) / 1000;

      const baseKey = `${boss.id}-${spawnMs}`;

      if (notifSettings.onBossSpawn) {
        if (diffSeconds <= 0 && diffSeconds > -1.2) {
          const key = `${baseKey}-spawn`;
          if (!firedNotificationsRef.current[key]) {
            firedNotificationsRef.current[key] = true;
            playNotificationSound(notifSettings.volume);
          }
        }
      }

      notifSettings.minutesBefore.forEach((m) => {
        const targetSeconds = m * 60;
        if (
          diffSeconds <= targetSeconds &&
          diffSeconds > targetSeconds - 1.2
        ) {
          const key = `${baseKey}-${m}`;
          if (!firedNotificationsRef.current[key]) {
            firedNotificationsRef.current[key] = true;
            playNotificationSound(notifSettings.volume);
          }
        }
      });
    });
  }, [now, notifSettings, selectedServer, maintenance, reports]);

  const handleServerSelect = (serverId: string) => {
    setSettings((s) => ({ ...s, selectedServerId: serverId }));
  };

  const displayedBosses = useMemo(() => {
    let baseBosses: Boss[];
    switch (activeTab) {
      case 'FIELD':
        baseBosses = FIELD_BOSSES;
        break;
      case 'DESTROYER':
        baseBosses = WORLD_BOSSES;
        break;
      case 'FAVORITES':
        baseBosses = BOSSES.filter((b) => isFavorite(b.id));
        break;
      default:
        baseBosses = BOSSES;
    }

    const searchedBosses = searchQuery
      ? baseBosses.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.spawnRegion.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : baseBosses;

    let predictions = searchedBosses.map((boss) => ({
      boss,
      prediction: getBossPrediction({
        boss,
        server: selectedServer,
        now,
        maintenance,
        reports,
      }),
    }));

    if (showOnlySoon) {
      const sixHoursInMs = 6 * 60 * 60 * 1000;
      predictions = predictions.filter(({ prediction }) => {
        if (!prediction) return false;
        const diff =
          prediction.nextSpawn.getTime() - now.getTime();
        return diff >= 0 && diff <= sixHoursInMs;
      });
    }

    const typePriority: Record<Boss['type'], number> = {
      FIELD: 0,
      WORLD: 1,
      DESTROYER: 2,
    };

    return predictions.sort((a, b) => {
      if (activeTab === 'ALL') {
        const pa = typePriority[a.boss.type] ?? 99;
        const pb = typePriority[b.boss.type] ?? 99;
        if (pa !== pb) return pa - pb;
      }

      if (!a.prediction) return 1;
      if (!b.prediction) return -1;

      const aTime = a.prediction.nextSpawn.getTime();
      const bTime = b.prediction.nextSpawn.getTime();

      if (aTime < now.getTime()) return 1;
      if (bTime < now.getTime()) return -1;

      return aTime - bTime;
    });
  }, [
    activeTab,
    isFavorite,
    favorites,
    searchQuery,
    showOnlySoon,
    selectedServer,
    now,
    maintenance,
    reports,
  ]);

  const nextOverallPrediction = useMemo(
    () =>
      getOverallNextBossPrediction(
        BOSSES,
        selectedServer,
        now,
        maintenance,
        reports
      ),
    [selectedServer, now, maintenance, reports]
  );

  const handleReportSubmit = (eventTime: Date) => {
    if (reportModalState.boss) {
      addReport({
        bossId: reportModalState.boss.id,
        serverId: selectedServer.id,
        eventTime,
      });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="World Boss Timer"
        description="Track world bosses on your server."
      >
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setIsNotifModalOpen(true)}
          >
            Notification Settings
          </Button>
          <Button onClick={handleOpenOverlay}>Open Overlay</Button>
        </div>
      </PageHeader>

      {nextOverallPrediction && (
        <div className="bg-gray-800/50 border border-primary-500/30 rounded-xl p-6 shadow-lg shadow-primary-500/5">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-400 mb-2">
            Next Boss: {nextOverallPrediction.boss.name}
          </p>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <p className="text-5xl font-mono font-bold text-primary-300">
              {formatDuration(
                (nextOverallPrediction.prediction.nextSpawn.getTime() -
                  now.getTime()) /
                1000
              )}
            </p>
            <div className="text-sm text-right mt-2 md:mt-0">
              <p>
                {getTimezoneLabel(settings.timezone || 'UTC+8')}:{' '}
                {formatTime(
                  nextOverallPrediction.prediction.nextSpawn,
                  settings.use24h,
                  settings.timezone || 'UTC+8'
                )}
              </p>
              <p className="text-gray-400 text-xs">
                Server: {formatTime(nextOverallPrediction.prediction.nextSpawn, true)} (UTC+7)
              </p>
              <PredictionSourceBadge
                prediction={nextOverallPrediction.prediction}
                reportsCount={
                  getReportsFor(
                    nextOverallPrediction.boss.id,
                    selectedServer.id
                  ).length
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Server selector */}
      <div className="bg-gray-800/50 border border-gray-700/60 rounded-xl p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-400 mb-3">
          Southeast Asia Server
        </h3>
        {['Horatio', 'Yvonne', 'Douglas', 'Santiago'].map((group) => (
          <div key={group}>
            <p className="text-xs text-gray-400 font-bold mt-2 mb-1">
              {group}
            </p>
            <div className="flex flex-wrap gap-2">
              {SEA_SERVERS.filter((s) => s.group === group).map(
                (server) => (
                  <button
                    key={server.id}
                    onClick={() => handleServerSelect(server.id)}
                    className={`py-2 px-3 rounded-md text-sm font-semibold transition-colors whitespace-nowrap ${selectedServer.id === server.id
                      ? 'bg-primary-600 text-white ring-2 ring-primary-400'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    {server.name}
                    {settings.myServerId === server.id && (
                      <span className="ml-1 text-xs text-primary-200">★</span>
                    )}
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stream Overlay settings (moved here from Settings.tsx) */}
      <Card title="Stream Overlay" className="mt-2">
        <p className="text-gray-400 mb-6 max-w-2xl">
          Add the Lordnine boss timer to your stream! Configure the settings
          below, copy the URL, and add it as a Browser Source in OBS or your
          preferred streaming software.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label
              htmlFor="overlayChannel"
              className="block text-sm font-medium text-gray-300"
            >
              Channel / Username
            </label>
            <input
              type="text"
              id="overlayChannel"
              value={overlaySettings.channel}
              onChange={(e) =>
                setOverlaySettings({
                  ...overlaySettings,
                  channel: e.target.value,
                })
              }
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <div>
            <label
              htmlFor="overlayServer"
              className="block text-sm font-medium text-gray-300"
            >
              Region / Server
            </label>
            <select
              id="overlayServer"
              value={overlaySettings.serverId}
              onChange={(e) =>
                setOverlaySettings({
                  ...overlaySettings,
                  serverId: e.target.value,
                })
              }
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3"
            >
              {Object.entries(serverGroups).map(([group, servers]) => (
                <optgroup label={group} key={group}>
                  {(servers as GameServer[]).map((server) => (
                    <option key={server.id} value={server.id}>
                      {server.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="overlayLanguage"
              className="block text-sm font-medium text-gray-300"
            >
              Language
            </label>
            <select
              id="overlayLanguage"
              value={overlaySettings.lang}
              onChange={(e) =>
                setOverlaySettings({
                  ...overlaySettings,
                  lang: e.target
                    .value as OverlaySettings['lang'],
                })
              }
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3"
            >
              <option value="en">English</option>
              <option value="id" disabled>
                Bahasa Indonesia (WIP)
              </option>
            </select>
          </div>
          <div>
            <label
              htmlFor="overlayShowRegion"
              className="block text-sm font-medium text-gray-300"
            >
              Show Region
            </label>
            <select
              id="overlayShowRegion"
              value={overlaySettings.showRegion ? '1' : '0'}
              onChange={(e) =>
                setOverlaySettings({
                  ...overlaySettings,
                  showRegion: e.target.value === '1',
                })
              }
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3"
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="overlayUrlInput"
            className="block text-sm font-medium text-gray-300"
          >
            Overlay URL
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="overlayUrlInput"
              readOnly
              value={overlayFullUrl}
              className="flex-1 block w-full rounded-none rounded-l-md bg-gray-900 border border-gray-600 px-3 py-2 text-xs md:text-sm"
            />
            <button
              onClick={handleCopyOverlayUrl}
              className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 text-sm"
            >
              {overlayCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Paste this URL into a Browser Source in OBS.
          </p>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-gray-200 mb-2">Preview</h4>
          <div className="bg-gray-900/50 p-4 rounded-lg flex justify-center items-center border border-gray-700">
            <OverlayCard
              server={overlayPreviewServer}
              prediction={overlayPreviewNextBoss}
              now={now}
              showRegion={overlaySettings.showRegion}
              lang={overlaySettings.lang}
            />
          </div>
        </div>
      </Card>

      {/* Search + filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search by name or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          <label className="flex items-center space-x-2 whitespace-nowrap">
            <input
              type="checkbox"
              checked={showOnlySoon}
              onChange={(e) => setShowOnlySoon(e.target.checked)}
              className="h-4 w-4 rounded border-gray-500 text-primary-600 bg-gray-800 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-300">
              Only spawning soon (6h)
            </span>
          </label>
        </div>
      </Card>

      <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {(['ALL', 'FIELD', 'DESTROYER', 'FAVORITES'] as BossFilter[]).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${activeTab === tab
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab.toLowerCase()}
              </button>
            )
          )}
        </nav>
      </div>

      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs text-gray-400 uppercase font-bold tracking-wider">
        <div className="col-span-3">Boss Info</div>
        <div className="col-span-2">Spawn Basis</div>
        <div className="col-span-2">Region</div>
        <div className="col-span-3">Next Spawn & Status</div>
      </div>

      <div className="space-y-4">
        {displayedBosses.length > 0 ? (
          displayedBosses.map(({ boss, prediction }) => {
            const status = getStatus(
              prediction?.nextSpawn ?? null,
              now
            );
            const isReportable =
              boss.type === 'FIELD' && boss.spawnMode === 'COOLDOWN';
            const reportsForBoss = isReportable
              ? getReportsFor(boss.id, selectedServer.id)
              : [];

            return (
              <div
                key={boss.id}
                className={`block md:grid grid-cols-12 gap-4 items-center bg-gray-800/50 border border-gray-700/60 rounded-xl p-4 transition-all duration-300 ${status.isSoon
                  ? 'border-l-4 border-emerald-400 bg-emerald-500/5'
                  : 'border-l-4 border-transparent'
                  }`}
              >
                {/* Col 1: Boss Info */}
                <div className="col-span-3 flex items-center gap-4">
                  <button
                    onClick={() => toggleFavorite(boss.id)}
                    className={
                      isFavorite(boss.id)
                        ? 'text-yellow-400'
                        : 'text-gray-600 hover:text-yellow-500'
                    }
                    aria-label="Toggle Favorite"
                  >
                    <StarIcon filled={isFavorite(boss.id)} />
                  </button>
                  <div className="text-center w-12 flex-shrink-0">
                    <p className="text-xs text-gray-400">LV</p>
                    <p className="text-2xl font-bold">{boss.level}</p>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-primary-400">
                      {boss.name}
                    </h3>
                    <p className="text-sm text-gray-400 capitalize">
                      {boss.type.toLowerCase()}
                    </p>
                  </div>
                </div>

                {/* Col 2: Spawn Basis */}
                <div className="col-span-2 text-sm mt-4 md:mt-0">
                  <p className="font-semibold text-gray-200 md:hidden mb-1">
                    Spawn Basis
                  </p>
                  {boss.spawnMode === 'COOLDOWN' ? (
                    <p>Respawn: {boss.cooldownHours}h</p>
                  ) : (
                    <ul className="text-xs">
                      {getScheduleSummary(boss).map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Col 3: Region */}
                <div className="col-span-2 text-sm mt-4 md:mt-0">
                  <p className="font-semibold text-gray-200 md:hidden mb-1">
                    Region
                  </p>
                  <p>{boss.spawnRegion}</p>
                </div>

                {/* Col 4: Next Spawn & Status */}
                <div className="col-span-3 text-sm mt-4 md:mt-0">
                  <p className="font-semibold text-gray-200 md:hidden mb-1">
                    Next Spawn & Status
                  </p>
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div>
                      {prediction ? (
                        <>
                          <p className="text-gray-300">
                            {getTimezoneLabel(settings.timezone || 'UTC+8')}:{' '}
                            {formatTime(
                              prediction.nextSpawn,
                              settings.use24h,
                              settings.timezone || 'UTC+8'
                            )}
                          </p>
                          <p className="text-gray-400 text-xs">
                            Server: {formatTime(prediction.nextSpawn, true)} (UTC+7)
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-400">Unknown</p>
                      )}
                    </div>
                    <div>
                      {prediction ? (
                        <div className="flex flex-col items-start md:items-end gap-2">
                          <p className="font-mono text-lg text-primary-300">
                            {formatDuration(
                              (prediction.nextSpawn.getTime() -
                                now.getTime()) /
                              1000
                            )}
                          </p>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                      ) : (
                        <p className="text-gray-400">-</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col md:flex-row gap-2 items-start justify-between">
                    <PredictionSourceBadge
                      prediction={prediction}
                      reportsCount={reportsForBoss.length}
                    />
                    {isReportable && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            setReportModalState({
                              isOpen: true,
                              boss,
                            })
                          }
                        >
                          Report Kill
                        </Button>
                        {reportsForBoss.length > 0 && (
                          <button
                            onClick={() =>
                              setViewReportsModalState({
                                isOpen: true,
                                boss,
                              })
                            }
                            className="text-xs text-primary-400 hover:underline"
                          >
                            View
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-500 bg-gray-800/50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-300">
              No Bosses Found
            </h3>
            {activeTab === 'FAVORITES' && favorites.length === 0 ? (
              <p className="mt-1 text-sm">
                You have no favorite bosses yet. Click the star on a boss
                to add it here.
              </p>
            ) : (
              <p className="mt-1 text-sm">
                No bosses match your current filters.
              </p>
            )}
          </div>
        )}
      </div>

      <NotificationSettingsModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        settings={notifSettings}
        onChange={setNotifSettings}
      />

      <ReportKillModal
        isOpen={reportModalState.isOpen}
        boss={reportModalState.boss}
        server={selectedServer}
        onClose={() =>
          setReportModalState({ isOpen: false, boss: null })
        }
        onSubmit={handleReportSubmit}
      />
      <ViewReportsModal
        isOpen={viewReportsModalState.isOpen}
        boss={viewReportsModalState.boss}
        reports={
          viewReportsModalState.boss
            ? getReportsFor(
              viewReportsModalState.boss.id,
              selectedServer.id
            )
            : []
        }
        onClose={() =>
          setViewReportsModalState({ isOpen: false, boss: null })
        }
        onUpvote={upvote}
        onDownvote={downvote}
        use24h={settings.use24h}
      />
    </div>
  );
};

export default BossTimer;
