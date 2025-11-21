
export type CodeStatus = 'AVAILABLE' | 'EXPIRED';

export interface RewardItem {
  id: string;        // internal id
  name: string;      // e.g. "Cron Stone"
  quantity: number;  // e.g. 2000
}

export interface GameCode {
  id: string;            // uuid or slug
  code: string;          // the redeem code string
  title: string;         // short label for the code
  description?: string;  // optional
  region: 'SEA' | 'GLOBAL' | 'KR' | 'JP' | 'OTHER';
  status: CodeStatus;
  availableSince?: string; // ISO date
  expiresAt?: string;      // ISO date
  rewards: RewardItem[];
}

export interface CodeSuggestion {
  id: string;
  code: string;
  region: 'SEA' | 'GLOBAL' | 'KR' | 'JP' | 'OTHER';
  rewardsText: string; // free-text description of rewards
  sourceUrl?: string;
  note?: string;
  createdAt: string;   // ISO string
}

export const GAME_CODES: GameCode[] = [
  {
    id: 'ln-launch-sea',
    code: 'LORDNINELIVE',
    title: 'Official Launch Celebration',
    description: 'Welcome gift for all players.',
    region: 'SEA',
    status: 'AVAILABLE',
    availableSince: '2025-01-01',
    rewards: [
      { id: 'gold', name: 'Gold', quantity: 100000 },
      { id: 'potions', name: 'HP Potions (L)', quantity: 50 },
    ],
  },
  {
    id: 'maintenance-gift',
    code: 'SORRY4WAIT',
    title: 'Maintenance Compensation',
    description: 'Compensation for extended maintenance on Tuesday.',
    region: 'SEA',
    status: 'AVAILABLE',
    availableSince: '2025-11-10',
    expiresAt: '2025-12-31',
    rewards: [
      { id: 'cron', name: 'Enhancement Stone', quantity: 5 },
    ],
  },
  {
    id: 'pre-reg-reward',
    code: 'PREREG2024',
    title: 'Pre-registration Milestone',
    description: 'Expired reward for early signups.',
    region: 'GLOBAL',
    status: 'EXPIRED',
    availableSince: '2024-12-01',
    expiresAt: '2025-01-01',
    rewards: [
      { id: 'mount', name: 'White Horse', quantity: 1 },
    ],
  },
];