
import { GrindSpot } from '../types';

export const grindSpots: GrindSpot[] = [
  {
    id: 'forgotten-plains',
    name: 'Forgotten Plains',
    recommendedCP: 10000,
    tags: ['gold', 'xp', 'beginner'],
    description: 'Good for early game leveling and steady gold income.'
  },
  {
    id: 'cursed-monastery',
    name: 'Cursed Monastery',
    recommendedCP: 25000,
    tags: ['materials', 'rare-drops'],
    description: 'High density of elites. Great for rare material farming.'
  },
  {
    id: 'sunken-city',
    name: 'Sunken City of Azjol',
    recommendedCP: 40000,
    tags: ['gold', 'epic-drops'],
    description: 'Top-tier gold per hour, but requires high CP to be efficient.'
  },
    {
    id: 'lava-caves',
    name: 'Lava Caves',
    recommendedCP: 55000,
    tags: ['xp', 'legendary-fragments'],
    description: 'Best XP in the game, but mobs hit very hard.'
  },
];
