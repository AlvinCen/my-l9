
import { ChecklistTask } from '../types';

export const checklistTasks: ChecklistTask[] = [
  // Dailies
  { id: 'daily_login', name: 'Daily Login Reward', type: 'daily', category: 'General' },
  { id: 'daily_dungeon_1', name: 'Chaos Dungeon x2', type: 'daily', category: 'Dungeon' },
  { id: 'daily_spire', name: 'Spire of Trials x3', type: 'daily', category: 'Dungeon' },
  { id: 'daily_guild_checkin', name: 'Guild Check-in', type: 'daily', category: 'Guild' },
  { id: 'daily_guild_donation', name: 'Guild Donation', type: 'daily', category: 'Guild' },
  { id: 'daily_field_boss', name: 'Participate in Field Boss', type: 'daily', category: 'Boss' },

  // Weeklies
  { id: 'weekly_abyss_raid', name: 'Abyssal Raid', type: 'weekly', category: 'Raid' },
  { id: 'weekly_guild_siege', name: 'Guild Siege', type: 'weekly', category: 'Guild' },
  { id: 'weekly_world_boss', name: 'World Boss x5', type: 'weekly', category: 'Boss' },
  { id: 'weekly_elite_dungeon', name: 'Elite Dungeon x3', type: 'weekly', category: 'Dungeon' },
  { id: 'weekly_pvp', name: 'Arena Participation x10', type: 'weekly', category: 'PvP' },
];
