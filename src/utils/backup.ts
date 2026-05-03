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

	triggerDownload(backup, `fittrack-${new Date().toISOString().split('T')[0]}.json`);
}

function triggerDownload(json: unknown, filename: string): void {
	const blob = new Blob([JSON.stringify(json, null, 2)], {
		type: 'application/json'
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export async function exportServerData(): Promise<void> {
	try {
		const res = await fetch('/api/data');
		if (!res.ok) throw new Error('not ok');
		const data: unknown = await res.json();
		triggerDownload(data, `fittrack-store-${new Date().toISOString().split('T')[0]}.json`);
	} catch {
		alert('Could not reach the server. This only works when running with npm run serve or on Fly.io.');
	}
}

export function importServerData(): void {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = '.json';
	input.onchange = e => {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = async evt => {
			try {
				const parsed: unknown = JSON.parse(evt.target?.result as string);
				if (
					typeof parsed !== 'object' ||
					parsed === null ||
					(!('shared' in parsed) && !('products' in parsed))
				) {
					alert('Invalid store file — expected a full server export.');
					return;
				}
				if (!confirm('This overwrites ALL data for ALL users on the server. Continue?'))
					return;
				const res = await fetch('/api/data', {
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify(parsed)
				});
				if (!res.ok) throw new Error('not ok');
				window.location.reload();
			} catch {
				alert('Import failed. Check the file and server connection.');
			}
		};
		reader.readAsText(file);
	};
	input.click();
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
