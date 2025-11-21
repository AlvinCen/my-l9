import { Boss } from '../types';

// Server timezone untuk Destroyer (SEA)
const SERVER_TZ = 'Asia/Singapore';
const ALL_DAYS: number[] = [0, 1, 2, 3, 4, 5, 6];

const DAILY_AT = (time: string) =>
  ALL_DAYS.map((dayOfWeek) => ({
    dayOfWeek,
    time,
    timezone: SERVER_TZ,
  }));

const DAILY_11 = DAILY_AT('10:00');
const DAILY_20 = DAILY_AT('19:00');


export const BOSSES: Boss[] = [
  // ======================
  // FIELD BOSSES (LIST \"ALL / FIELD\")
  // ======================
  {
    id: 'venatus',
    name: 'Venatus',
    level: 60,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 10,
    spawnRegion: 'Corrupted River Stream',
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'viorent',
    name: 'Viorent',
    level: 65,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 10,
    spawnRegion: 'Gill Stream',
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'ego',
    name: 'Ego',
    level: 70,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 21,
    spawnRegion: 'Reclaimed Gathering Point',
    mainRewards: ['Main rewards as in-game'],
  },

  // Clemantis di list Field, punya jadwal tetap
  {
    id: 'clemantis',
    name: 'Clemantis',
    level: 70,
    type: 'FIELD',
    spawnMode: 'FIXED_SCHEDULE',
    schedules: [
      { dayOfWeek: 1, time: '10:30', timezone: 'Asia/Singapore' }, // Monday 10:30
      { dayOfWeek: 4, time: '18:00', timezone: 'Asia/Singapore' }, // Thursday 18:00
    ],
    spawnRegion: 'White Witch\'s Cradle',
    mainRewards: ['Main rewards as in-game'],
  },

  {
    id: 'livera',
    name: 'Livera',
    level: 75,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 24,
    spawnRegion: 'Black Storm Peninsula',
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'araneo',
    name: 'Araneo',
    level: 75,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 24,
    spawnRegion: 'Lower Tomb of Tyriosa 1F',
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'undomiel',
    name: 'Undomiel',
    level: 80,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 24,
    spawnRegion: 'Test Subject Lab',
    mainRewards: ['Main rewards as in-game'],
  },

  {
    id: 'saphirus',
    name: 'Saphirus',
    level: 80,
    type: 'FIELD',
    spawnMode: 'FIXED_SCHEDULE',
    schedules: [
      { dayOfWeek: 0, time: '16:00', timezone: 'Asia/Singapore' }, // Sunday 16:00
      { dayOfWeek: 2, time: '10:30', timezone: 'Asia/Singapore' }, // Tuesday 10:30
    ],
    spawnRegion: 'Moonlight Shackle',
    mainRewards: ['Main rewards as in-game'],
  },

  {
    id: 'neutro',
    name: 'Neutro',
    level: 80,
    type: 'FIELD',
    spawnMode: 'FIXED_SCHEDULE',
    schedules: [
      { dayOfWeek: 2, time: '18:00', timezone: 'Asia/Singapore' }, // Tuesday 18:00
      { dayOfWeek: 4, time: '10:30', timezone: 'Asia/Singapore' }, // Thursday 10:30
    ],
    spawnRegion: 'Battlefield of Love and Hatred',
    mainRewards: ['Main rewards as in-game'],
  },

  {
    id: 'lady_dalia',
    name: 'Lady Dalia',
    level: 85,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 18,
    spawnRegion: 'Bloody Shadow',
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'general_aqueleus',
    name: 'General Aqueleus',
    level: 85,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 29,
    spawnRegion: 'Lower Tomb of Tyriosa 2F',
    mainRewards: ['Main rewards as in-game'],
  },

  {
    id: 'thymele',
    name: 'Thymele',
    level: 85,
    type: 'FIELD',
    spawnMode: 'FIXED_SCHEDULE',
    schedules: [
      { dayOfWeek: 1, time: '18:00', timezone: 'Asia/Singapore' }, // Monday 18:00
      { dayOfWeek: 3, time: '10:30', timezone: 'Asia/Singapore' }, // Wednesday 10:30
    ],
    spawnRegion: 'Mark of Rampage',
    mainRewards: ['Main rewards as in-game'],
  },

  {
    id: 'amentis',
    name: 'Amentis',
    level: 88,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 29,
    spawnRegion: 'Limestone Cape',
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'baron_braudmore',
    name: 'Baron Braudmore',
    level: 88,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 32,
    spawnRegion: 'Rosevine Bridge',
    mainRewards: ['Main rewards as in-game'],
  },

  {
    id: 'milavy',
    name: 'Milavy',
    level: 90,
    type: 'FIELD',
    spawnMode: 'FIXED_SCHEDULE',
    schedules: [
      { dayOfWeek: 6, time: '14:00', timezone: 'Asia/Singapore' }, // Saturday 14:00
    ],
    spawnRegion: 'Lower Tomb of Tyriosa 3F',
    mainRewards: ['Main rewards as in-game'],
  },

  {
    id: 'wannitas',
    name: 'Wannitas',
    level: 93,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 48,
    spawnRegion: 'Snare Swamp',
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'metus',
    name: 'Metus',
    level: 93,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 48,
    spawnRegion: 'Follower\'s Field',
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'duplican',
    name: 'Duplican',
    level: 93,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 48,
    spawnRegion: 'Open-Eyed Puppet\'s Throne',
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'shuliar',
    name: 'Shuliar',
    level: 95,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 35,
    spawnRegion: 'Masquerade of Hounds',
    mainRewards: ['Main rewards as in-game'],
  },

  {
    id: 'ringor',
    name: 'Ringor',
    level: 95,
    type: 'FIELD',
    spawnMode: 'FIXED_SCHEDULE',
    schedules: [
      { dayOfWeek: 6, time: '16:00', timezone: 'Asia/Singapore' }, // Saturday 16:00
    ],
    spawnRegion: 'Torchlight Highway',
    mainRewards: ['Main rewards as in-game'],
  },

  {
    id: 'roderick',
    name: 'Roderick',
    level: 95,
    type: 'FIELD',
    spawnMode: 'FIXED_SCHEDULE',
    schedules: [
      { dayOfWeek: 5, time: '18:00', timezone: 'Asia/Singapore' }, // Friday 18:00
    ],
    spawnRegion: 'Garbana Underground Waterway 1F',
    mainRewards: ['Main rewards as in-game'],
  },

  {
    id: 'gareth',
    name: 'Gareth',
    level: 98,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 32,
    spawnRegion: 'Deadman\'s Land District 1',
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'titore',
    name: 'Titore',
    level: 98,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 37,
    spawnRegion: 'Deadman\'s Land District 2',
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'larba',
    name: 'Larba',
    level: 98,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 35,
    spawnRegion: 'Garbana Reclaimed Land',
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'catena',
    name: 'Catena',
    level: 100,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 35,
    spawnRegion: 'Deadman\'s Land District 3',
    mainRewards: ['Main rewards as in-game'],
  },

  {
    id: 'auraq',
    name: 'Auraq',
    level: 100,
    type: 'FIELD',
    spawnMode: 'FIXED_SCHEDULE',
    schedules: [
      { dayOfWeek: 5, time: '21:00', timezone: 'Asia/Singapore' }, // Friday 21:00
      { dayOfWeek: 3, time: '20:00', timezone: 'Asia/Singapore' }, // Wednesday 20:00
    ],
    spawnRegion: 'Garbana Underground Waterway 2F',
    mainRewards: ['Main rewards as in-game'],
  },

  {
    id: 'secreta',
    name: 'Secreta',
    level: 100,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 62,
    spawnRegion: 'Kallion\'s Tomb',
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'ordo',
    name: 'Ordo',
    level: 100,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 62,
    spawnRegion: 'Successor\'s Paradise',
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'asta',
    name: 'Asta',
    level: 100,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 62,
    spawnRegion: 'Goldblood Plain',
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'supore',
    name: 'Supore',
    level: 100,
    type: 'FIELD',
    spawnMode: 'COOLDOWN',
    cooldownHours: 62,
    spawnRegion: 'Goldblood Plain',
    mainRewards: ['Main rewards as in-game'],
  },

  {
    id: 'chaiflock',
    name: 'Chaiflock',
    level: 120,
    type: 'FIELD',
    spawnMode: 'FIXED_SCHEDULE',
    schedules: [
      { dayOfWeek: 6, time: '21:00', timezone: 'Asia/Singapore' }, // Saturday 21:00
    ],
    spawnRegion: 'Kallion\'s Tomb',
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'benji',
    name: 'Benji',
    level: 120,
    type: 'FIELD',
    spawnMode: 'FIXED_SCHEDULE',
    schedules: [
      { dayOfWeek: 0, time: '20:00', timezone: 'Asia/Singapore' }, // Sunday 20:00
    ],
    spawnRegion: 'Nest of Vengeance',
    mainRewards: ['Main rewards as in-game'],
  },

  // ======================
  // DESTROYER BOSSES (TAB "DESTROYER")
  // ======================
  {
    id: 'ratan',
    name: 'Ratan',
    level: 60,
    type: 'DESTROYER',
    spawnMode: 'FIXED_SCHEDULE',
    // Daily 10:00–11:00 dan 19:00–20:00 (jam mulai) - UTC+7 server time
    schedules: [...DAILY_11, ...DAILY_20],
    spawnRegion: 'Tomb of Time',
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'parto',
    name: 'Parto',
    level: 85,
    type: 'DESTROYER',
    spawnMode: 'FIXED_SCHEDULE',
    // Sama: daily 10:00 & 19:00
    schedules: [...DAILY_11, ...DAILY_20],
    spawnRegion: "Magic Puppets's Yearning",
    mainRewards: ['Main rewards as in-game'],
  },
  {
    id: 'nedra',
    name: 'Nedra',
    level: 105,
    type: 'DESTROYER',
    spawnMode: 'FIXED_SCHEDULE',
    // Sama: daily 10:00 & 19:00
    schedules: [...DAILY_11, ...DAILY_20],
    spawnRegion: 'Bloodsoaked Plateau',
    mainRewards: ['Main rewards as in-game'],
  },
];

export const FIELD_BOSSES = BOSSES.filter((b) => b.type === 'FIELD');
export const WORLD_BOSSES = BOSSES.filter((b) => b.type === 'DESTROYER' || b.type === 'WORLD');
