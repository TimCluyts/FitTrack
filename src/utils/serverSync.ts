import {useNutritionStore} from '../store/nutritionStore';
import {useLogStore} from '../store/logStore';
import {useWeightStore} from '../store/weightStore';
import {useTrainingStore} from '../store/trainingStore';

const API = '/api/data';
const DEBOUNCE_MS = 1000;

let saveTimer: ReturnType<typeof setTimeout> | null = null;

function snapshot() {
	const {products, recipes} = useNutritionStore.getState();
	const {logEntries} = useLogStore.getState();
	const {weightEntries} = useWeightStore.getState();
	const {exercises, routines, workoutLogs} = useTrainingStore.getState();
	return {products, recipes, logEntries, weightEntries, exercises, routines, workoutLogs};
}

function scheduleSave() {
	if (saveTimer) clearTimeout(saveTimer);
	saveTimer = setTimeout(async () => {
		try {
			await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(snapshot())
			});
		} catch {
			// server went away — ignore, localStorage still has the data
		}
	}, DEBOUNCE_MS);
}

export async function initServerSync(): Promise<boolean> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 1500);

	try {
		const res = await fetch(API, {signal: controller.signal});
		clearTimeout(timeout);
		if (!res.ok) return false;

		const data = await res.json();

		if (Object.keys(data).length === 0) {
			// Server file is empty (first run) — push localStorage state into it
			await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(snapshot())
			});
		} else {
			// Server has data — it is the source of truth, override localStorage
			if (Array.isArray(data.products)) {
				useNutritionStore.setState({
					products: data.products,
					recipes: data.recipes ?? []
				});
			}
			if (Array.isArray(data.logEntries)) {
				useLogStore.setState({logEntries: data.logEntries});
			}
			if (Array.isArray(data.weightEntries)) {
				useWeightStore.setState({weightEntries: data.weightEntries});
			}
			if (Array.isArray(data.exercises)) {
				useTrainingStore.setState({
					exercises: data.exercises,
					routines: data.routines ?? [],
					workoutLogs: data.workoutLogs ?? []
				});
			}
		}

		// Subscribe after hydration so the initial setState calls don't trigger a write-back
		useNutritionStore.subscribe(scheduleSave);
		useLogStore.subscribe(scheduleSave);
		useWeightStore.subscribe(scheduleSave);
		useTrainingStore.subscribe(scheduleSave);

		return true;
	} catch {
		clearTimeout(timeout);
		return false; // server not running — localStorage takes over silently
	}
}
