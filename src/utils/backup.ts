import {useNutritionStore} from '../store/nutritionStore';
import {useLogStore} from '../store/logStore';
import {useWeightStore} from '../store/weightStore';
import {useTrainingStore} from '../store/trainingStore';
import type {
	Exercise,
	LogEntry,
	Product,
	Recipe,
	Routine,
	WeightEntry,
	WorkoutLog
} from '../types/fitness';

export interface FullBackup {
	products: Product[];
	recipes: Recipe[];
	logEntries?: LogEntry[];
	weightEntries?: WeightEntry[];
	exercises?: Exercise[];
	routines?: Routine[];
	workoutLogs?: WorkoutLog[];
}

export function exportData(): void {
	const {products, recipes} = useNutritionStore.getState();
	const {logEntries} = useLogStore.getState();
	const {weightEntries} = useWeightStore.getState();
	const {exercises, routines, workoutLogs} = useTrainingStore.getState();

	const backup: FullBackup = {
		products,
		recipes,
		logEntries,
		weightEntries,
		exercises,
		routines,
		workoutLogs
	};

	const blob = new Blob([JSON.stringify(backup, null, 2)], {
		type: 'application/json'
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `fittrack-${new Date().toISOString().split('T')[0]}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export function importFromFile(onImport: (data: FullBackup) => void): void {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = '.json';
	input.onchange = e => {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = evt => {
			try {
				const parsed = JSON.parse(evt.target?.result as string);
				if (Array.isArray(parsed.products)) {
					onImport(parsed);
				} else {
					alert('Invalid backup file.');
				}
			} catch {
				alert('Could not read the file.');
			}
		};
		reader.readAsText(file);
	};
	input.click();
}
