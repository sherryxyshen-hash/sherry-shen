
export enum GrassType {
  COOL_SEASON = 'Cool-Season (Fescue, Bluegrass, Ryegrass)',
  WARM_SEASON = 'Warm-Season (Bermuda, St. Augustine, Zoysia)',
}

export enum SoilType {
  CLAY = 'Clay',
  SANDY = 'Sandy',
  LOAM = 'Loam',
  UNSURE = 'Unsure / Default',
}

export enum LawnCondition {
  HEALTHY = 'Healthy & Green',
  YELLOWING = 'Yellowing / Nutrient Deficient',
  PATCHY = 'Patchy / Thin',
  STRESSED = 'Heat/Drought Stressed',
}

export interface UserProfile {
  location: {
    lat: number;
    lng: number;
    city?: string;
  } | null;
  grassType: GrassType;
  soilType: SoilType;
  lastFertilized: string | null;
  condition: LawnCondition;
}

export interface FertilizerRecommendation {
  productName: string;
  npkRatio: string;
  applicationRate: string;
  timing: string;
  bestPractices: string[];
  reasoning: string;
  nextStepDate: string;
}

export interface ApplicationLog {
  id: string;
  date: string;
  productUsed: string;
  notes: string;
}

export interface LawnState {
  profile: UserProfile;
  history: ApplicationLog[];
  recommendation: FertilizerRecommendation | null;
  healthScore: number;
  lawnImage: string | null;
}
