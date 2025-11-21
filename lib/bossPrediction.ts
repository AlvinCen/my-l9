import { Boss, GameServer, MaintenanceInfo, BossPrediction, BossSchedule, BossReport } from '../types';

// Hardcoded server timezone offset for SEA (UTC+7 for Asia/Bangkok)
const SERVER_TIMEZONE_OFFSET_MINUTES = 7 * 60;

function applyTimezoneOffset(date: Date, offsetMinutes: number): Date {
    return new Date(date.getTime() + offsetMinutes * 60 * 1000);
}

function removeTimezoneOffset(date: Date, offsetMinutes: number): Date {
    return new Date(date.getTime() - offsetMinutes * 60 * 1000);
}

/**
 * Computes the next spawn time for a boss with a fixed, weekly schedule.
 */
export function computeNextSpawnForFixedSchedule(options: {
  boss: Boss;
  server: GameServer;
  now: Date;
}): BossPrediction | null {
  const { boss, server, now } = options;
  if (boss.spawnMode !== 'FIXED_SCHEDULE' || !boss.schedules?.length) {
    return null;
  }

  const upcomingSpawns: { date: Date; schedule: BossSchedule }[] = [];
  const nowInServerTz = applyTimezoneOffset(now, SERVER_TIMEZONE_OFFSET_MINUTES);

  boss.schedules.forEach(schedule => {
    const [hour, minute] = schedule.time.split(':').map(Number);
    const currentDayInServerTz = nowInServerTz.getUTCDay();
    
    // Calculate days until next scheduled day
    let dayDiff = schedule.dayOfWeek - currentDayInServerTz;
    if (dayDiff < 0) {
      dayDiff += 7; // It's next week
    }

    const potentialSpawnServerTime = new Date(nowInServerTz);
    potentialSpawnServerTime.setUTCDate(nowInServerTz.getUTCDate() + dayDiff);
    potentialSpawnServerTime.setUTCHours(hour, minute, 0, 0);

    // If the time today has already passed, schedule for next week
    if (potentialSpawnServerTime <= nowInServerTz) {
      potentialSpawnServerTime.setUTCDate(potentialSpawnServerTime.getUTCDate() + 7);
    }

    upcomingSpawns.push({
      date: removeTimezoneOffset(potentialSpawnServerTime, SERVER_TIMEZONE_OFFSET_MINUTES),
      schedule: schedule,
    });
  });

  if (upcomingSpawns.length === 0) {
    return null;
  }

  upcomingSpawns.sort((a, b) => a.date.getTime() - b.date.getTime());
  const nextSpawnData = upcomingSpawns[0];

  return {
    bossId: boss.id,
    serverId: server.id,
    source: 'FIXED_SCHEDULE',
    nextSpawn: nextSpawnData.date,
    scheduleUsed: nextSpawnData.schedule,
  };
}

/**
 * Computes the next spawn time for a boss with a cooldown, based on the last maintenance time.
 */
export function computeNextSpawnForCooldown(options: {
  boss: Boss;
  server: GameServer;
  now: Date;
  maintenance: MaintenanceInfo;
}): BossPrediction | null {
  const { boss, server, now, maintenance } = options;
  const cooldown = boss.cooldownHours;
  if (!cooldown) return null;

  const maintenanceTime = new Date(maintenance.lastCompletedAt);
  const cooldownMs = cooldown * 60 * 60 * 1000;

  // If we are before or at the first maintenance, the first spawn is simply maintenance + cooldown
  if (now.getTime() <= maintenanceTime.getTime()) {
      const nextSpawn = new Date(maintenanceTime.getTime() + cooldownMs);
      return {
          bossId: boss.id,
          serverId: server.id,
          source: 'MAINTENANCE_BASED',
          nextSpawn,
          cooldownHours: cooldown,
      };
  }

  const diffMs = now.getTime() - maintenanceTime.getTime();
  const cycles = Math.floor(diffMs / cooldownMs);
  const nextSpawn = new Date(maintenanceTime.getTime() + (cycles + 1) * cooldownMs);
  
  return {
    bossId: boss.id,
    serverId: server.id,
    source: 'MAINTENANCE_BASED',
    nextSpawn,
    cooldownHours: cooldown,
  };
}

/**
 * Computes the next spawn time for a boss based on community reports.
 */
export function computeNextSpawnForCommunityReport(options: {
  boss: Boss;
  server: GameServer;
  now: Date;
  reports: BossReport[];
}): BossPrediction | null {
  const { boss, server, now, reports } = options;
  const cooldown = boss.cooldownHours;

  if (boss.spawnMode !== 'COOLDOWN' || !cooldown || reports.length === 0) {
    return null;
  }
  
  // Find the most reliable report (most recent with positive score)
  const sortedReports = reports
      .filter(r => r.bossId === boss.id && r.serverId === server.id && r.upvotes > r.downvotes)
      .sort((a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime());
  
  const lastValidReport = sortedReports[0];

  if (!lastValidReport) {
      return null;
  }

  const lastKillTime = new Date(lastValidReport.eventTime);
  const cooldownMs = cooldown * 60 * 60 * 1000;
  
  let nextSpawn = new Date(lastKillTime.getTime() + cooldownMs);

  // If that spawn time is in the past, calculate the next one from there
  if (nextSpawn.getTime() < now.getTime()) {
      const diffMs = now.getTime() - lastKillTime.getTime();
      const cycles = Math.floor(diffMs / cooldownMs);
      nextSpawn = new Date(lastKillTime.getTime() + (cycles + 1) * cooldownMs);
  }

  return {
    bossId: boss.id,
    serverId: server.id,
    source: 'COMMUNITY_REPORT',
    nextSpawn,
    cooldownHours: cooldown,
  };
}


/**
 * Main entry point to get a spawn prediction for a given boss.
 */
export function getBossPrediction(options: {
  boss: Boss;
  server: GameServer;
  now: Date;
  maintenance: MaintenanceInfo | undefined;
  reports: BossReport[];
}): BossPrediction | null {
  const { boss, server, now, maintenance, reports } = options;

  if (boss.spawnMode === 'FIXED_SCHEDULE') {
    return computeNextSpawnForFixedSchedule({ boss, server, now });
  }

  if (boss.spawnMode === 'COOLDOWN') {
    // Prioritize community reports
    const communityPrediction = computeNextSpawnForCommunityReport({ boss, server, now, reports });
    if (communityPrediction) {
      return communityPrediction;
    }
    // Fallback to maintenance
    if (maintenance) {
        return computeNextSpawnForCooldown({ boss, server, now, maintenance });
    }
  }

  return null; // Unknown or unsupported case
}


/**
 * Helper to find the single next boss prediction from a list of bosses.
 */
export function getOverallNextBossPrediction(
    bosses: Boss[], 
    server: GameServer, 
    now: Date, 
    maintenance: MaintenanceInfo | undefined,
    reports: BossReport[]
): { boss: Boss, prediction: BossPrediction } | null {
    
    const allPredictions = bosses
        .map(boss => {
            const prediction = getBossPrediction({ boss, server, now, maintenance, reports });
            return prediction ? { boss, prediction } : null;
        })
        .filter((p): p is { boss: Boss, prediction: BossPrediction } => p !== null && p.prediction.nextSpawn >= now);

    if (allPredictions.length === 0) return null;

    allPredictions.sort((a, b) => a.prediction.nextSpawn.getTime() - b.prediction.nextSpawn.getTime());
    
    return allPredictions[0];
}
