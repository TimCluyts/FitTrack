export function formatPace(paceMinPerKm: number): string {
	const mins = Math.floor(paceMinPerKm);
	const secs = Math.round((paceMinPerKm - mins) * 60);
	return `${mins}:${String(secs).padStart(2, '0')} min/km`;
}
