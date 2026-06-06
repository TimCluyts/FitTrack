import {useState} from 'react';
import {useAddMeasurementEntry} from '../../hooks/useApi';
import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import {Field} from '../ui/Field';

const today = () => new Date().toISOString().slice(0, 10);

export function MeasurementsLogForm() {
	const addMeasurementEntry = useAddMeasurementEntry();
	const [date, setDate] = useState(today);
	const [waist, setWaist] = useState('');
	const [chest, setChest] = useState('');
	const [note, setNote] = useState('');

	const handleAdd = () => {
		const waistCm = parseFloat(waist) || undefined;
		const chestCm = parseFloat(chest) || undefined;
		if (!waistCm && !chestCm) return;
		addMeasurementEntry.mutate({
			date,
			waistCm,
			chestCm,
			note: note.trim() || undefined
		});
		setWaist('');
		setChest('');
		setNote('');
	};

	const canSave = !!waist || !!chest;

	return (
		<Card>
			<div
				style={{
					fontWeight: 600,
					fontSize: '15px',
					color: '#1b4332',
					marginBottom: '16px'
				}}>
				Log Measurements
			</div>
			<div
				style={{
					display: 'flex',
					gap: '12px',
					flexWrap: 'wrap',
					alignItems: 'flex-end'
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
					<Field.Label>Waist (cm)</Field.Label>
					<Field.Input
						type="number"
						value={waist}
						placeholder="e.g. 82.0"
						step="0.1"
						min="0"
						onChange={e => setWaist(e.target.value)}
						onKeyDown={e => e.key === 'Enter' && handleAdd()}
					/>
				</Field>
				<Field>
					<Field.Label>Chest (cm)</Field.Label>
					<Field.Input
						type="number"
						value={chest}
						placeholder="e.g. 96.0"
						step="0.1"
						min="0"
						onChange={e => setChest(e.target.value)}
						onKeyDown={e => e.key === 'Enter' && handleAdd()}
					/>
				</Field>
				<Field style={{flex: '2 1 180px'}}>
					<Field.Label>Note (optional)</Field.Label>
					<Field.Input
						type="text"
						value={note}
						placeholder="e.g. morning"
						onChange={e => setNote(e.target.value)}
						onKeyDown={e => e.key === 'Enter' && handleAdd()}
					/>
				</Field>
				<Button
					disabled={!canSave}
					onClick={handleAdd}
					style={{marginBottom: '1px'}}>
					Save
				</Button>
			</div>
		</Card>
	);
}
