import {useNutritionStore} from '../store/nutritionStore';
import type {LogEntry, Product, Recipe} from '../types/fitness';

export function exportData(): void {
	const {products, logEntries, recipes} = useNutritionStore.getState();
	const blob = new Blob(
		[JSON.stringify({products, logEntries, recipes}, null, 2)],
		{
			type: 'application/json'
		}
	);
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `fittrack-${new Date().toISOString().split('T')[0]}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export function importFromFile(
	onImport: (data: {
		products: Product[];
		logEntries: LogEntry[];
		recipes?: Recipe[];
	}) => void
): void {
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
				if (
					Array.isArray(parsed.products) &&
					Array.isArray(parsed.logEntries)
				) {
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
