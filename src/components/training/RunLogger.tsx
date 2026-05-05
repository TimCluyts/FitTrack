import {useRunLogForm} from '../../hooks/useRunLogForm';
import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import {Field} from '../ui/Field';

interface RunLoggerProps {
	onSave: () => void;
	onCancel: () => void;
}

export function RunLogger({onSave, onCancel}: RunLoggerProps) {
	const {
		date, setDate,
		distanceKm, setDistanceKm,
		durationMin, setDurationMin,
		speedKmh, setSpeedKmh,
		kcal, setKcal,
		note, setNote,
		latestWeight,
		canSave,
		pace,
		handleSave
	} = useRunLogForm(onSave);

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
					{pace && <Field.Hint>Pace: {pace}</Field.Hint>}
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
