import {useEffect, useState} from 'react';
import {Card} from '../ui/Card';
import {Button} from '../ui/Button';
import {Field} from '../ui/Field';
import {useAddRunLog, useWeightEntries} from '../../hooks/useApi';

interface RunLoggerProps {
	onSave: () => void;
	onCancel: () => void;
}

function formatPace(distanceKm: number, durationMin: number): string {
	if (distanceKm <= 0) return '';
	const paceTotal = durationMin / distanceKm;
	const mins = Math.floor(paceTotal);
	const secs = Math.round((paceTotal - mins) * 60);
	return `${mins}:${String(secs).padStart(2, '0')} min/km`;
}

export function RunLogger({onSave, onCancel}: RunLoggerProps) {
	const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
	const [distanceKm, setDistanceKm] = useState('');
	const [durationMin, setDurationMin] = useState('');
	const [speedKmh, setSpeedKmh] = useState('');
	const [kcal, setKcal] = useState('');
	const [note, setNote] = useState('');
	const addRunLog = useAddRunLog();
	const {data: weightEntries = []} = useWeightEntries();
	const latestWeight = weightEntries.length > 0
		? [...weightEntries].sort((a, b) => b.date.localeCompare(a.date))[0].weight
		: null;

	useEffect(() => {
		const d = parseFloat(distanceKm);
		const t = parseFloat(durationMin);
		if (d > 0 && t > 0) {
			setSpeedKmh(((d / t) * 60).toFixed(2));
		}
	}, [distanceKm, durationMin]);

	useEffect(() => {
		const d = parseFloat(distanceKm);
		if (d > 0 && latestWeight != null) {
			setKcal(Math.round(latestWeight * d).toString());
		}
	}, [distanceKm, latestWeight]);

	const canSave = distanceKm !== '' && parseFloat(distanceKm) > 0;

	const pace =
		distanceKm && durationMin
			? formatPace(parseFloat(distanceKm), parseFloat(durationMin))
			: null;

	const handleSave = () => {
		if (!canSave) return;
		addRunLog.mutate({
			date,
			distanceKm: parseFloat(distanceKm),
			...(durationMin ? {durationMin: parseFloat(durationMin)} : {}),
			...(speedKmh ? {speedKmh: parseFloat(speedKmh)} : {}),
			...(kcal ? {kcal: parseFloat(kcal)} : {}),
			...(note.trim() ? {note: note.trim()} : {})
		});
		onSave();
	};

	return (
		<Card>
			<div
				style={{
					fontWeight: 600,
					fontSize: '15px',
					color: '#1b4332',
					marginBottom: '16px'
				}}>
				Log Run
			</div>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
					gap: '8px'
				}}>
				<Field>
					<Field.Label>Date</Field.Label>
					<Field.Input
						type="date"
						value={date}
						onChange={e => setDate(e.target.value)}
					/>
				</Field>
				<Field>
					<Field.Label>Distance (km)</Field.Label>
					<Field.Input
						type="number"
						min="0"
						step="0.01"
						value={distanceKm}
						onChange={e => setDistanceKm(e.target.value)}
						placeholder="5.00"
					/>
				</Field>
				<Field>
					<Field.Label>Duration (min)</Field.Label>
					<Field.Input
						type="number"
						min="0"
						step="1"
						value={durationMin}
						onChange={e => setDurationMin(e.target.value)}
						placeholder="optional"
					/>
					{pace && (
						<Field.Hint>Pace: {pace}</Field.Hint>
					)}
				</Field>
				<Field>
					<Field.Label>Avg speed (km/h)</Field.Label>
					<Field.Input
						type="number"
						min="0"
						step="0.1"
						value={speedKmh}
						onChange={e => setSpeedKmh(e.target.value)}
						placeholder="optional"
					/>
				</Field>
				<Field>
					<Field.Label>Calories (kcal)</Field.Label>
					<Field.Input
						type="number"
						min="0"
						value={kcal}
						onChange={e => setKcal(e.target.value)}
						placeholder="optional"
					/>
					{latestWeight != null && kcal && (
						<Field.Hint>Based on {latestWeight} kg</Field.Hint>
					)}
					{latestWeight == null && (
						<Field.Hint>Log weight for auto-calc</Field.Hint>
					)}
				</Field>
			</div>
			<Field style={{marginTop: '8px'}}>
				<Field.Label>Note</Field.Label>
				<Field.Input
					value={note}
					onChange={e => setNote(e.target.value)}
					placeholder="optional"
				/>
			</Field>
			<div style={{display: 'flex', gap: '8px', marginTop: '16px'}}>
				<Button disabled={!canSave} onClick={handleSave}>
					Save Run
				</Button>
				<Button variant="outline" onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</Card>
	);
}
