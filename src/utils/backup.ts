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
		const res = await fetch('/api/store');
		if (!res.ok) throw new Error('not ok');
		const data: unknown = await res.json();
		triggerDownload(data, `fittrack-store-${new Date().toISOString().split('T')[0]}.json`);
	} catch {
		alert('Could not reach the server.');
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
					!Array.isArray((parsed as Record<string, unknown>).users)
				) {
					alert('Invalid store file — expected a full server export with a users array.');
					return;
				}
				if (!confirm('This overwrites ALL data for ALL users on the server. Continue?'))
					return;
				const res = await fetch('/api/store', {
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
