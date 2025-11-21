
import { ClassDefinition, Ability, Tag } from '../types';

export const classes: ClassDefinition[] = [
    { id: 'berserker', name: 'Berserker', weaponType: 'Greatsword', role: 'DPS' },
    { id: 'paladin', name: 'Paladin', weaponType: 'Sword & Shield', role: 'Tank' },
    { id: 'ranger', name: 'Ranger', weaponType: 'Bow', role: 'DPS' },
    { id: 'cleric', name: 'Cleric', weaponType: 'Mace', role: 'Support' },
    { id: 'sorceress', name: 'Sorceress', weaponType: 'Staff', role: 'DPS' },
    { id: 'shadowblade', name: 'Shadowblade', weaponType: 'Daggers', role: 'DPS' },
    { id: 'battlemage', name: 'Battlemage', weaponType: 'Spellblade', role: 'Hybrid' }
];

export const abilities: Ability[] = [
    // Berserker
    { id: 'whirlwind', name: 'Whirlwind', description: 'Spin your weapon, dealing AoE damage.', tags: ['AoE', 'Damage'] },
    { id: 'charge', name: 'Charge', description: 'Dash forward, stunning the first enemy hit.', tags: ['Mobility', 'CC'] },
    { id: 'sundering_strike', name: 'Sundering Strike', description: 'A powerful downward slash that reduces enemy defense.', tags: ['Debuff', 'Damage'] },
    // Paladin
    { id: 'holy_shield', name: 'Holy Shield', description: 'Block incoming attacks and reflect a portion of damage.', tags: ['Defense', 'Taunt'] },
    { id: 'judgment', name: 'Judgment', description: 'Slam your shield, provoking nearby enemies.', tags: ['Taunt', 'AoE'] },
    // Ranger
    { id: 'multi_shot', name: 'Multi-shot', description: 'Fire a cone of arrows, hitting multiple targets.', tags: ['AoE', 'Damage'] },
    { id: 'evasive_shot', name: 'Evasive Shot', description: 'Leap backwards while firing a slowing arrow.', tags: ['Mobility', 'CC'] },
    // Cleric
    { id: 'healing_light', name: 'Healing Light', description: 'Heal a single ally for a large amount.', tags: ['Heal', 'Support'] },
    { id: 'divine_protection', name: 'Divine Protection', description: 'Grant an ally a damage-absorbing shield.', tags: ['Defense', 'Support'] },
    // Sorceress
    { id: 'fireball', name: 'Fireball', description: 'Hurl a ball of fire that explodes on impact.', tags: ['Damage', 'AoE'] },
    { id: 'meteor', name: 'Meteor', description: 'Call down a meteor for massive AoE damage.', tags: ['Damage', 'AoE'] },
    { id: 'ice_nova', name: 'Ice Nova', description: 'Emit a wave of frost, freezing nearby enemies.', tags: ['CC', 'AoE'] },
];

export const tags: Tag[] = [
    { id: 'crowd-control', name: 'Crowd Control', description: 'Focuses on stunning, slowing, or otherwise disabling enemies.' },
    { id: 'burst-damage', name: 'Burst Damage', description: 'Specializes in dealing a large amount of damage in a short time.' },
    { id: 'sustain', name: 'Sustain', description: 'Enhances survival through healing or defensive buffs.' },
    { id: 'mobility', name: 'Mobility', description: 'Improves movement speed and provides dashes or teleports.' },
    { id: 'aoe-specialist', name: 'AoE Specialist', description: 'Excels at dealing damage to multiple targets at once.' },
    { id: 'single-target', name: 'Single-Target', description: 'Focuses on eliminating one high-priority target.' }
];
