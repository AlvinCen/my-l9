import { Boss, BossSchedule } from '../types';

export function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 0) totalSeconds = 0;

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (days > 0) {
    return `${days}d ${hours.toString().padStart(2, '0')}h`;
  }

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');
}

export type Timezone = 'UTC+7' | 'UTC+8' | 'UTC+9';

// Convert server time (UTC+7) to a specific timezone
export function convertToTimezone(date: Date, timezone: Timezone = 'UTC+8'): Date {
  // Get UTC timestamp
  const utcTime = date.getTime();

  // Server time is UTC+7, so we need to get the actual UTC time first
  // Assuming input date is in server time (UTC+7)
  const serverOffset = 7 * 60; // minutes
  const actualUtc = utcTime - (serverOffset * 60 * 1000);

  // Get target timezone offset
  const timezoneOffsets: Record<Timezone, number> = {
    'UTC+7': 7 * 60,
    'UTC+8': 8 * 60,
    'UTC+9': 9 * 60,
  };

  const targetOffset = timezoneOffsets[timezone];
  const targetTime = actualUtc + (targetOffset * 60 * 1000);

  return new Date(targetTime);
}

export function formatTime(date: Date, use24h: boolean, timezone?: Timezone): string {
  // If timezone is provided, convert the date to that timezone
  const displayDate = timezone ? convertToTimezone(date, timezone) : date;

  return displayDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !use24h
  });
}

export function getTimezoneLabel(timezone: Timezone): string {
  const labels: Record<Timezone, string> = {
    'UTC+7': 'UTC+7',
    'UTC+8': 'UTC+8',
    'UTC+9': 'UTC+9',
  };
  return labels[timezone];
}

export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// NOTE: This function is deprecated and will be removed. It only works with the old simple data structure.
// Use `calculateNextSpawn` for the new `Boss` type.
export function getNextSpawn(spawnTimes: string[]): { nextSpawnDate: Date, isSpawning: boolean } {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const spawnDateTimes = spawnTimes
    .map(time => new Date(`${today}T${time}:00Z`))
    .sort((a, b) => a.getTime() - b.getTime());

  let nextSpawnDate = spawnDateTimes.find(d => d.getTime() > now.getTime());

  if (!nextSpawnDate) {
    const tomorrow = new Date(now);
    tomorrow.setUTCDate(now.getUTCDate() + 1);
    const tomorrowDateStr = tomorrow.toISOString().split('T')[0];
    nextSpawnDate = new Date(`${tomorrowDateStr}T${spawnDateTimes[0].toTimeString().split(' ')[0]}Z`);
  }

  let isSpawning = false;
  for (const spawn of spawnDateTimes) {
    const diffSeconds = (now.getTime() - spawn.getTime()) / 1000;
    if (diffSeconds > 0 && diffSeconds < 60 * 5) {
      isSpawning = true;
      break;
    }
  }
  if (nextSpawnDate) {
    const diffSeconds = (nextSpawnDate.getTime() - now.getTime()) / 1000;
    if (diffSeconds < 60 * 5) {
      isSpawning = true;
    }
  }

  return { nextSpawnDate, isSpawning };
}

/**
 * Calculates the next spawn date for a boss with a fixed schedule.
 * @param boss The boss object with schedules.
 * @param now The current date/time.
 * @returns The next spawn Date object, or null if no schedule is found.
 */
export function calculateNextSpawn(boss: Boss, now: Date): Date | null {
  if (boss.spawnMode !== 'FIXED_SCHEDULE' || !boss.schedules?.length) {
    return null;
  }

  const upcomingSpawns: Date[] = [];

  // This is a simplified approach. A robust library like date-fns-tz would be better.
  // Assuming server timezone is UTC+7 (Asia/Bangkok) as per data.
  const serverTimezoneOffset = 7 * 60;
  const nowUtc = now.getTime();
  const nowServer = new Date(nowUtc + serverTimezoneOffset * 60 * 1000);

  boss.schedules.forEach(schedule => {
    const [hour, minute] = schedule.time.split(':').map(Number);

    // Check for spawns in the current week
    for (let i = 0; i < 7; i++) {
      const potentialSpawnServerTime = new Date(nowServer);
      potentialSpawnServerTime.setUTCDate(potentialSpawnServerTime.getUTCDate() - potentialSpawnServerTime.getUTCDay() + schedule.dayOfWeek + i);
      potentialSpawnServerTime.setUTCHours(hour, minute, 0, 0);

      if (potentialSpawnServerTime > nowServer) {
        // Convert back to local timezone for comparison
        const potentialSpawnLocalTime = new Date(potentialSpawnServerTime.getTime() - serverTimezoneOffset * 60 * 1000);
        upcomingSpawns.push(potentialSpawnLocalTime);
      }
    }
  });

  if (upcomingSpawns.length === 0) {
    // If no spawns this week, find the first one next week
    const nextWeekServer = new Date(nowServer);
    nextWeekServer.setUTCDate(nowServer.getUTCDate() + 7);

    const firstSchedule = boss.schedules.sort((a, b) => a.dayOfWeek - b.dayOfWeek)[0];
    const [hour, minute] = firstSchedule.time.split(':').map(Number);

    const nextWeekSpawnServerTime = new Date(nextWeekServer);
    nextWeekSpawnServerTime.setUTCDate(nextWeekSpawnServerTime.getUTCDate() - nextWeekSpawnServerTime.getUTCDay() + firstSchedule.dayOfWeek);
    nextWeekSpawnServerTime.setUTCHours(hour, minute, 0, 0);

    upcomingSpawns.push(new Date(nextWeekSpawnServerTime.getTime() - serverTimezoneOffset * 60 * 1000));
  }

  upcomingSpawns.sort((a, b) => a.getTime() - b.getTime());

  return upcomingSpawns[0] || null;
}
