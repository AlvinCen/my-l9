
import { GearItem, GearSlot, Rarity } from '../types';

export const gearSlots: GearSlot[] = ["weapon", "offhand", "helmet", "armor", "gloves", "boots", "accessory1", "accessory2", "necklace", "ring"];

export const rarityColors: Record<Rarity, string> = {
    common: 'text-gray-300',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-orange-400',
    mythic: 'text-red-500'
};

export const gearItems: GearItem[] = [
  // Weapons
  { id: 'w_epic_sword', name: 'Epic Knight Sword', slot: 'weapon', rarity: 'epic', stats: { cp: 1500, attack: 300 } },
  { id: 'w_leg_bow', name: 'Legendary Dragon Bow', slot: 'weapon', rarity: 'legendary', stats: { cp: 2500, attack: 450, crit: 50 } },
  { id: 'w_myth_staff', name: 'Mythic World-Ender Staff', slot: 'weapon', rarity: 'mythic', stats: { cp: 5000, attack: 800, crit: 100 } },
  
  // Offhands
  { id: 'oh_epic_shield', name: 'Epic Aegis', slot: 'offhand', rarity: 'epic', stats: { cp: 1200, defense: 400 } },
  { id: 'oh_leg_orb', name: 'Legendary Orb of Power', slot: 'offhand', rarity: 'legendary', stats: { cp: 2000, attack: 150, crit: 30 } },

  // Armor
  { id: 'h_leg_helm', name: 'Legendary Helm of Valor', slot: 'helmet', rarity: 'legendary', stats: { cp: 1800, defense: 300, hp: 1000 } },
  { id: 'a_leg_chest', name: 'Legendary Plate of Resilience', slot: 'armor', rarity: 'legendary', stats: { cp: 2200, defense: 450, hp: 1500 } },
  { id: 'g_leg_gloves', name: 'Legendary Gauntlets of Fury', slot: 'gloves', rarity: 'legendary', stats: { cp: 1600, attack: 100, crit: 40 } },
  { id: 'b_leg_boots', name: 'Legendary Greaves of Haste', slot: 'boots', rarity: 'legendary', stats: { cp: 1600, defense: 200, hp: 500 } },
  
  // Accessories
  { id: 'acc1_mythic_ring', name: 'Mythic Ring of the Overlord', slot: 'accessory1', rarity: 'mythic', stats: { cp: 3000, attack: 200, crit: 80 } },
  { id: 'acc2_mythic_earring', name: 'Mythic Earring of Whispers', slot: 'accessory2', rarity: 'mythic', stats: { cp: 3000, defense: 150, hp: 1000 } },
  { id: 'n_mythic_amulet', name: 'Mythic Amulet of Eternity', slot: 'necklace', rarity: 'mythic', stats: { cp: 3500, attack: 150, defense: 150, hp: 1500 } },
  { id: 'r_mythic_ring2', name: 'Mythic Soulstone Ring', slot: 'ring', rarity: 'mythic', stats: { cp: 3000, attack: 250, defense: 50 } },
];
