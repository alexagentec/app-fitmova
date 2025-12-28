
export interface Transaction {
  id: string;
  fromName: string;
  level: 1 | 2 | 3;
  percentage: number;
  amount: number;
  date: string;
}

export interface NetworkMember {
  name: string;
  level: 1 | 2 | 3;
  joinDate: string;
  isActive: boolean;
  whatsapp?: string; // Novo campo
}

export type CareerLevelType = 'START' | 'BUILDER' | 'LEADER' | 'ELITE' | 'PRIME' | 'MASTER' | 'LEGACY' | 'ORIGIN';

export interface UserProfile {
  name: string;
  whatsapp?: string; // Novo campo
  age: number;
  sex: 'Masculino' | 'Feminino' | 'Outro';
  weight: number;
  height: number;
  activityLevel: 'sedentario' | 'leve' | 'moderado' | 'intenso' | 'atleta';
  healthHistory: string;
  injuries: string;
  inactivityTime: string;
  goal: 'weight_loss' | 'hypertrophy' | 'endurance' | 'health' | 'rehabilitation';
  level: 'iniciante' | 'intermediario' | 'avancado';
  environment: 'gym' | 'outdoor' | 'home_objects' | 'bodyweight';
  daysPerWeek: number;
  timePerWorkout: number;
  subscriptionTier: 'free' | 'premium';
  subscriptionPeriod?: 'monthly' | 'yearly';
  referralCode: string;
  referredBy?: string;
  balance: number;
  referralCount: number; // Diretos
  indirectCount: number; // Indiretos
  currentCareerLevel: CareerLevelType;
  network: NetworkMember[];
  transactions: Transaction[];
}

export interface BMIResult {
  score: number;
  category: string;
  interpretation: string;
  color: string;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  instructions: string;
  targetMuscles: string[];
  safetyNotes: string;
}

export interface DayWorkout {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  planName: string;
  level: string;
  environment: string;
  weeklySchedule: DayWorkout[];
  generalAdvice: string;
}

export interface MealSuggestion {
  time: string;
  mealName: string;
  items: string[];
  substitutions: string[];
}

export interface DietPlan {
  objective: string;
  dailyCaloriesHint: string;
  meals: MealSuggestion[];
  generalTips: string[];
}

export interface HealthTip {
  title: string;
  content: string;
}
