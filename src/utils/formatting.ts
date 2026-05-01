export function formatDate(d: Date): string {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function friendlyDate(dateStr: string, today: string): string {
	const diff = Math.round(
		(new Date(today + 'T00:00:00').getTime() -
			new Date(dateStr + 'T00:00:00').getTime()) /
			86_400_000
	);
	if (diff === 0) return 'Today';
	if (diff === 1) return 'Yesterday';
	if (diff === -1) return 'Tomorrow';
	return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric'
	});
}
