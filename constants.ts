
import { GrassType, SoilType, LawnCondition } from './types';

export const DEFAULT_PROFILE = {
  location: null,
  grassType: GrassType.COOL_SEASON,
  soilType: SoilType.LOAM,
  lastFertilized: null,
  condition: LawnCondition.HEALTHY,
};

export const BADGES = [
  { id: 'first_step', name: 'First Step', description: 'Log your first fertilizer application', icon: '🌱' },
  { id: 'green_thumb', name: 'Green Thumb', description: 'Maintain a 90+ health score', icon: '👍' },
  { id: 'eco_warrior', name: 'Eco Warrior', description: 'Apply sustainable lawn practices', icon: '🌍' },
  { id: 'consistency_king', name: 'Consistency King', description: 'Apply 3 times on schedule', icon: '👑' },
];
