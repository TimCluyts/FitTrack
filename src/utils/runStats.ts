import type {RunLog} from '../types/fitness';

export function calcPRDistance(runs: RunLog[]): number | null {
	return runs.reduce<number | null>(
		(max, r) => (max === null || r.distanceKm > max ? r.distanceKm : max),
		null
	);
}

export function calcPRSpeed(runs: RunLog[]): number | null {
	return runs.reduce<number | null>(
		(max, r) =>
			r.speedKmh != null && (max === null || r.speedKmh > max) ? r.speedKmh : max,
		null
	);
}

export function calcPRPace(runs: RunLog[]): number | null {
	return runs.reduce<number | null>((best, r) => {
		if (r.durationMin == null || r.distanceKm <= 0) return best;
		const pace = r.durationMin / r.distanceKm;
		return best === null || pace < best ? pace : best;
	}, null);
}
