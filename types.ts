export interface NutritionData {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  weight_g: number;
  description?: string;
}

export interface LogEntry extends NutritionData {
  id: string;
  timestamp: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}