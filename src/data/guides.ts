
import { Guide } from '../types';

export const guides: Guide[] = [
  {
    slug: 'beginner-guide',
    title: 'Beginner Guide',
    description: 'Everything you need to know to get started in Lordnine: Infinite Class.',
    content: `
      <h2 class="text-2xl font-bold mb-4">Welcome to Lordnine!</h2>
      <p class="mb-4">This guide will walk you through the first few hours of the game, helping you understand the core systems.</p>
      <h3 class="text-xl font-semibold mb-2">1. Choosing Your Class</h3>
      <p class="mb-4">Your first choice is your starting class. Don't worry too much, as the 'Infinite Class' system allows you to unlock and switch between others later. For beginners, Paladin (Tanky) or Ranger (Ranged DPS) are great choices.</p>
      <h3 class="text-xl font-semibold mb-2">2. The Main Quest</h3>
      <p class="mb-4">Follow the main story quest (marked with a golden icon). It provides the most XP, gear, and unlocks essential game features like dungeons, guilds, and the Spire of Trials.</p>
      <h3 class="text-xl font-semibold mb-2">3. Understanding CP (Combat Power)</h3>
      <p class="mb-4">CP is the primary measure of your character's strength. It increases mainly by upgrading your gear. Focus on enhancing your weapon first for a significant damage boost.</p>
      <h3 class="text-xl font-semibold mb-2">4. Daily Checklist</h3>
      <p>Make sure to complete your daily tasks! They are a crucial source of materials, currency, and other rewards. Use the Checklist tool on this site to keep track.</p>
    `
  },
  {
    slug: 'cp-progression-guide',
    title: 'CP Progression Guide',
    description: 'A roadmap for efficiently increasing your Combat Power.',
    content: `
      <h2 class="text-2xl font-bold mb-4">How to Get Stronger, Faster</h2>
      <p class="mb-4">Stuck at a certain CP level? This guide provides a prioritized list of activities to boost your power.</p>
      <h3 class="text-xl font-semibold mb-2">Priority 1: Gear Enhancement</h3>
      <p class="mb-4">Your gear is the single biggest source of CP. Always use your enhancement stones. Aim to get your full set to +10, then focus on your weapon to +15, then the rest of your armor to +15.</p>
      <h3 class="text-xl font-semibold mb-2">Priority 2: Soul Stones</h3>
      <p class="mb-4">Equip and upgrade Soul Stones. Even low-grade stones provide a substantial stat boost. Combine duplicates to level them up.</p>
      <h3 class="text-xl font-semibold mb-2">Priority 3: Class & Tag Synergy</h3>
      <p class="mb-4">Unlocking new classes and leveling them up gives permanent stat bonuses to your entire account. Experiment with different class and tag combinations to find powerful synergies that suit your playstyle. Use the Class & Tag Planner to theorycraft!</p>
      <h3 class="text-xl font-semibold mb-2">Priority 4: Guild Buffs</h3>
      <p>Join an active guild. The passive buffs provided by a high-level guild are a significant and constant source of extra stats and CP.</p>
    `
  }
];
