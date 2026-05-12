import type {DailyGoals, Exercise, LogEntry, PriceEntry, Product, Recipe, Routine, RunLog, Store, WeightEntry, WorkoutLog} from '../types/fitness';
import type {User} from '../store/userStore';

const BASE = '/api';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${BASE}${path}`, {
		headers: {'Content-Type': 'application/json'},
		...init
	});
	if (!res.ok) throw new Error(`${res.status}`);
	return res.json() as Promise<T>;
}

const post = (path: string, body: unknown) =>
	apiFetch(path, {method: 'POST', body: JSON.stringify(body)});
const put = (path: string, body: unknown) =>
	apiFetch(path, {method: 'PUT', body: JSON.stringify(body)});
const del = (path: string) => apiFetch(path, {method: 'DELETE'});

export const api = {
	getUsers: () => apiFetch<User[]>('/users'),

	getProducts: () => apiFetch<Product[]>('/products'),
	addProduct: (d: Omit<Product, 'id'>) => post('/products', d) as Promise<Product>,
	updateProduct: (id: string, d: Partial<Omit<Product, 'id'>>) => put(`/products/${id}`, d) as Promise<Product>,
	deleteProduct: (id: string) => del(`/products/${id}`),

	getRecipes: () => apiFetch<Recipe[]>('/recipes'),
	addRecipe: (d: Omit<Recipe, 'id'>) => post('/recipes', d) as Promise<Recipe>,
	updateRecipe: (id: string, d: Partial<Omit<Recipe, 'id'>>) => put(`/recipes/${id}`, d) as Promise<Recipe>,
	deleteRecipe: (id: string) => del(`/recipes/${id}`),

	getLog: (uid: string) => apiFetch<LogEntry[]>(`/users/${uid}/log`),
	addLogEntry: (uid: string, d: Omit<LogEntry, 'id'>) => post(`/users/${uid}/log`, d) as Promise<LogEntry>,
	updateLogEntry: (uid: string, id: string, d: Partial<Pick<LogEntry, 'amount' | 'portions'>>) => put(`/users/${uid}/log/${id}`, d) as Promise<LogEntry>,
	deleteLogEntry: (uid: string, id: string) => del(`/users/${uid}/log/${id}`),

	getWeight: (uid: string) => apiFetch<WeightEntry[]>(`/users/${uid}/weight`),
	addWeightEntry: (uid: string, d: Omit<WeightEntry, 'id'>) => post(`/users/${uid}/weight`, d) as Promise<WeightEntry>,
	deleteWeightEntry: (uid: string, id: string) => del(`/users/${uid}/weight/${id}`),

	getExercises: (uid: string) => apiFetch<Exercise[]>(`/users/${uid}/exercises`),
	addExercise: (uid: string, d: Omit<Exercise, 'id'>) => post(`/users/${uid}/exercises`, d) as Promise<Exercise>,
	updateExercise: (uid: string, id: string, d: Partial<Omit<Exercise, 'id'>>) => put(`/users/${uid}/exercises/${id}`, d) as Promise<Exercise>,
	deleteExercise: (uid: string, id: string) => del(`/users/${uid}/exercises/${id}`),

	getRoutines: (uid: string) => apiFetch<Routine[]>(`/users/${uid}/routines`),
	addRoutine: (uid: string, d: Omit<Routine, 'id'>) => post(`/users/${uid}/routines`, d) as Promise<Routine>,
	updateRoutine: (uid: string, id: string, d: Partial<Omit<Routine, 'id'>>) => put(`/users/${uid}/routines/${id}`, d) as Promise<Routine>,
	deleteRoutine: (uid: string, id: string) => del(`/users/${uid}/routines/${id}`),

	getWorkoutLogs: (uid: string) => apiFetch<WorkoutLog[]>(`/users/${uid}/workout-logs`),
	addWorkoutLog: (uid: string, d: Omit<WorkoutLog, 'id'>) => post(`/users/${uid}/workout-logs`, d) as Promise<WorkoutLog>,
	deleteWorkoutLog: (uid: string, id: string) => del(`/users/${uid}/workout-logs/${id}`),

	getRunLogs: (uid: string) => apiFetch<RunLog[]>(`/users/${uid}/run-logs`),
	addRunLog: (uid: string, d: Omit<RunLog, 'id'>) => post(`/users/${uid}/run-logs`, d) as Promise<RunLog>,
	deleteRunLog: (uid: string, id: string) => del(`/users/${uid}/run-logs/${id}`),

	getGoals: (uid: string) => apiFetch<DailyGoals>(`/users/${uid}/goals`),
	setGoals: (uid: string, goals: DailyGoals) => put(`/users/${uid}/goals`, goals) as Promise<DailyGoals>,

	getFavorites: (uid: string) => apiFetch<string[]>(`/users/${uid}/favorites`),
	setFavorites: (uid: string, ids: string[]) => put(`/users/${uid}/favorites`, ids) as Promise<string[]>,

	getStores: () => apiFetch<Store[]>('/stores'),
	addStore: (d: Omit<Store, 'id'>) => post('/stores', d) as Promise<Store>,
	updateStore: (id: string, d: Partial<Omit<Store, 'id'>>) => put(`/stores/${id}`, d) as Promise<Store>,
	deleteStore: (id: string) => del(`/stores/${id}`),

	getPrices: () => apiFetch<PriceEntry[]>('/prices'),
	addPrice: (d: Omit<PriceEntry, 'id'>) => post('/prices', d) as Promise<PriceEntry>,
	updatePrice: (id: string, d: Partial<Omit<PriceEntry, 'id'>>) => put(`/prices/${id}`, d) as Promise<PriceEntry>,
	deletePrice: (id: string) => del(`/prices/${id}`),
};
