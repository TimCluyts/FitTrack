import {useNutritionStore} from '../store/nutritionStore';
import {useLogStore} from '../store/logStore';
import {useWeightStore} from '../store/weightStore';
import {useTrainingStore} from '../store/trainingStore';
import {useUserStore} from '../store/userStore';
import type {UserId} from '../store/userStore';
import type {
	Exercise,
	LogEntry,
	Product,
	Recipe,
	Routine,
	WeightEntry,
	WorkoutLog
} from '../types/fitness';

const API = '/api/data';
const DEBOUNCE_MS = 1000;

interface UserData {
	logEntries?: LogEntry[];
	weightEntries?: WeightEntry[];
	exercises?: Exercise[];
	routines?: Routine[];
	workoutLogs?: WorkoutLog[];
}

interface ServerData {
	// Current format
	shared?: {products?: Product[]; recipes?: Recipe[]};
	users?: Partial<Record<UserId, UserData>>;
	// Old flat format — kept for backward-compat migration
	products?: Product[];
	recipes?: Recipe[];
}

let cachedData: ServerData = {};
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function buildPayload(userId: UserId): ServerData {
	const {products, recipes} = useNutritionStore.getState();
	const {logEntries} = useLogStore.getState();
	const {weightEntries} = useWeightStore.getState();
	const {exercises, routines, workoutLogs} = useTrainingStore.getState();

	const payload: ServerData = {
		shared: {products, recipes},
		users: {
			...cachedData.users,
			[userId]: {logEntries, weightEntries, exercises, routines, workoutLogs}
		}
	};
	cachedData = payload;
	return payload;
}

function scheduleSave(userId: UserId) {
	if (saveTimer) clearTimeout(saveTimer);
	saveTimer = setTimeout(async () => {
		try {
			await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(buildPayload(userId))
			});
		} catch {
			// server went away — localStorage still has the data
		}
	}, DEBOUNCE_MS);
}

function hydrateUser(userId: UserId) {
	const userData = cachedData.users?.[userId];
	if (!userData) return;
	if (Array.isArray(userData.logEntries)) {
		useLogStore.setState({logEntries: userData.logEntries});
	}
	if (Array.isArray(userData.weightEntries)) {
		useWeightStore.setState({weightEntries: userData.weightEntries});
	}
	if (Array.isArray(userData.exercises)) {
		useTrainingStore.setState({
			exercises: userData.exercises,
			routines: userData.routines ?? [],
			workoutLogs: userData.workoutLogs ?? []
		});
	}
}

export async function initServerSync(): Promise<boolean> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 1500);

	try {
		const res = await fetch(API, {signal: controller.signal});
		clearTimeout(timeout);
		if (!res.ok) return false;

		const data: ServerData = await res.json();

		if (Object.keys(data).length === 0) {
			// First run — write empty structure so subsequent saves merge correctly
			cachedData = {shared: {products: [], recipes: []}, users: {}};
			await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(cachedData)
			});
		} else if (data.shared) {
			// Current format
			cachedData = data;
			if (Array.isArray(data.shared.products)) {
				useNutritionStore.setState({
					products: data.shared.products,
					recipes: data.shared.recipes ?? []
				});
			}
			const activeUserId = useUserStore.getState().activeUserId;
			if (activeUserId) hydrateUser(activeUserId);
		} else if (Array.isArray(data.products)) {
			// Old flat format — migrate: treat as shared data, no per-user history
			useNutritionStore.setState({
				products: data.products,
				recipes: data.recipes ?? []
			});
			cachedData = {
				shared: {products: data.products, recipes: data.recipes ?? []},
				users: {}
			};
		}

		// When user switches, load their slice from the cached server data
		useUserStore.subscribe((state, prev) => {
			if (state.activeUserId && state.activeUserId !== prev.activeUserId) {
				hydrateUser(state.activeUserId);
			}
		});

		// When any store changes, save the current user's slice to the server
		const save = () => {
			const userId = useUserStore.getState().activeUserId;
			if (userId) scheduleSave(userId);
		};
		useNutritionStore.subscribe(save);
		useLogStore.subscribe(save);
		useWeightStore.subscribe(save);
		useTrainingStore.subscribe(save);

		return true;
	} catch {
		clearTimeout(timeout);
		return false;
	}
}
