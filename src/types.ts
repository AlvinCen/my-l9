
// FIX: Removed an incorrect import of `BossSchedule`. The `BossSchedule` interface is defined within this file, so the import was unnecessary.

export type BossType = "FIELD" | "WORLD" | "DESTROYER";
export type SpawnMode = "COOLDOWN" | "FIXED_SCHEDULE";

export interface BossSchedule {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  time: string; // "HH:mm" 24h format
  timezone: string; // e.g., "Asia/Bangkok"
}

export interface Boss {
  id: string;
  name: string;
  level: number;
  type: BossType;
  spawnMode: SpawnMode;
  cooldownHours?: number;
  schedules?: BossSchedule[];
  spawnRegion: string;
  mainRewards: string[];
}

export interface GameServer {
  id: string;
  name: string;
  group: 'Horatio' | 'Yvonne' | 'Douglas' | 'Santiago';
  region: 'SEA';
}

export interface MaintenanceInfo {
  region: string;
  lastCompletedAt: string; // ISO string with timezone
}

// --- NEW PREDICTION TYPES ---
export type PredictionSource =
  | "FIXED_SCHEDULE"
  | "MAINTENANCE_BASED"
  | "COMMUNITY_REPORT";

export interface BossPrediction {
  bossId: string;
  serverId: string;
  source: PredictionSource;
  nextSpawn: Date;
  cooldownHours?: number;
  scheduleUsed?: BossSchedule;
}
// --- END NEW PREDICTION TYPES ---

// --- NEW COMMUNITY REPORT TYPES ---
export interface BossReport {
  id: string;
  bossId: string;
  serverId: string;
  eventTime: string; // ISO string for the kill/spawn time
  createdAt: string; // ISO string for when the report was created
  upvotes: number;
  downvotes: number;
}
// --- END NEW COMMUNITY REPORT TYPES ---

export interface GrindSpot {
  id: string;
  name: string;
  recommendedCP: number;
  description?: string;
  tags: string[];
}

export interface GrindSession {
  id: string;
  spotId: string;
  startTime: string; // ISO
  endTime: string; // ISO
  durationMinutes: number;
  goldEarned: number;
  xpPercentGained: number;
  notes?: string;
}

export interface ClassDefinition {
  id: string;
  name: string;
  weaponType: string;
  role: "DPS" | "Tank" | "Support" | "Hybrid";
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

export interface Tag {
  id: string;
  name: string;
  description: string;
}

export interface ClassBuild {
  id: string;
  name: string;
  classId: string;
  abilities: string[]; // max 6
  tags: string[]; // max 3
  notes?: string;
}

export type GearSlot = "weapon" | "offhand" | "helmet" | "armor" | "gloves" | "boots" | "accessory1" | "accessory2" | "necklace" | "ring";

export type Rarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export interface GearItem {
  id: string;
  name: string;
  slot: GearSlot;
  rarity: Rarity;
  stats: {
    cp?: number;
    attack?: number;
    defense?: number;
    crit?: number;
    hp?: number;
  };
}

export interface GearBuild {
  id: string;
  name: string;
  slotAssignments: Partial<Record<GearSlot, string | null>>; // item IDs
}

export interface ChecklistTask {
  id: string;
  name: string;
  type: "daily" | "weekly";
  category: string;
  description?: string;
}

export type ChecklistState = {
  [dateKey: string]: {
    [taskId: string]: boolean;
  };
};

export interface Guide {
  slug: string;
  title: string;
  description: string;
  content: string;
}

export interface Settings {
  region: string;
  use24h: boolean;
  selectedServerId?: string;
  myServerId?: string;
  isAdmin?: boolean;
}
