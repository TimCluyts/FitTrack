import {useState} from 'react';
import {useAddWeightEntry} from '../../hooks/useApi';
import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import {Field} from '../ui/Field';

const today = () => new Date().toISOString().slice(0, 10);

export function WeightLogForm() {
	const addWeightEntry = useAddWeightEntry();
	const [date, setDate] = useState(today);
	const [weight, setWeight] = useState('');
	const [note, setNote] = useState('');

	const handleAdd = () => {
		const kg = parseFloat(weight);
		if (!kg || kg <= 0) return;
		addWeightEntry.mutate({date, weight: kg, note: note.trim() || undefined});
		setWeight('');
		setNote('');
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
				Log Weight
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
					<Field.Label>Weight (kg)</Field.Label>
					<Field.Input
						type="number"
						value={weight}
						placeholder="e.g. 75.5"
						step="0.1"
						min="0"
						autoFocus
						onChange={e => setWeight(e.target.value)}
						onKeyDown={e => e.key === 'Enter' && handleAdd()}
					/>
				</Field>
				<Field style={{flex: '2 1 200px'}}>
					<Field.Label>Note (optional)</Field.Label>
					<Field.Input
						type="text"
						value={note}
						placeholder="e.g. morning, fasted"
						onChange={e => setNote(e.target.value)}
						onKeyDown={e => e.key === 'Enter' && handleAdd()}
					/>
				</Field>
				<Button
					disabled={!weight}
					onClick={handleAdd}
					style={{marginBottom: '1px'}}>
					Save
				</Button>
			</div>
		</Card>
	);
}
