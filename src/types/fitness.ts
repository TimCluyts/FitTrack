export type MealTime = 'morning' | 'lunch' | 'in-between' | 'evening' | 'snack';

export const MEAL_TIMES: {value: MealTime; label: string}[] = [
	{value: 'morning', label: 'Morning'},
	{value: 'lunch', label: 'Lunch'},
	{value: 'in-between', label: 'In-Between'},
	{value: 'evening', label: 'Evening'},
	{value: 'snack', label: 'Snack'}
];

export interface Product {
	id: string;
	name: string;
	kcal: number;
	protein: number;
	fat: number;
	carbs: number;
	servingSize?: number; // grams per serving
	servingLabel?: string; // plural label, e.g. "slices", "pieces"
}

export interface RecipeIngredient {
	productId: string;
	amount: number;
}

export interface Recipe {
	id: string;
	name: string;
	ingredients: RecipeIngredient[];
}

export interface LogEntry {
	id: string;
	date: string;
	mealTime: MealTime;
	// product entry
	productId?: string;
	amount?: number;
	// recipe entry
	recipeId?: string;
	portions?: number;
}

export interface MacroTotals {
	kcal: number;
	protein: number;
	fat: number;
	carbs: number;
}

export interface WeightEntry {
	id: string;
	date: string;
	weight: number;
	note?: string;
}

export interface Exercise {
	id: string;
	name: string;
}

export interface RoutineExercise {
	exerciseId: string;
	targetSets: number;
	targetReps?: number;
}

export interface Routine {
	id: string;
	name: string;
	exercises: RoutineExercise[];
}

export interface WorkoutSet {
	weight: number;
	reps: number;
}

export interface WorkoutExercise {
	exerciseId: string;
	sets: WorkoutSet[];
}

export interface WorkoutLog {
	id: string;
	date: string;
	routineId: string;
	routineName: string;
	exercises: WorkoutExercise[];
}

export interface RunLog {
	id: string;
	date: string;
	distanceKm: number;
	durationMin?: number;
	speedKmh?: number;
	kcal?: number;
	note?: string;
}

export interface DailyGoals {
	kcalMin?: number;
	kcalMax?: number;
	protein?: number;
	fat?: number;
	carbs?: number;
}
