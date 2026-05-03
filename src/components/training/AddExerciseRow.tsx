import {useState} from 'react';
import {Button} from '../ui/Button';
import {Field} from '../ui/Field';
import {useExercises, useAddExercise} from '../../hooks/useApi';

interface AddExerciseRowProps {
	onAdd: (exerciseId: string, targetSets: number, targetReps?: number) => void;
}

export function AddExerciseRow({onAdd}: AddExerciseRowProps) {
	const {data: exercises = []} = useExercises();
	const addExerciseMutation = useAddExercise();
	const [name, setName] = useState('');
	const [sets, setSets] = useState('3');
	const [reps, setReps] = useState('');

	const handleAdd = async () => {
		const trimmed = name.trim();
		const setsNum = parseInt(sets, 10);
		if (!trimmed || !setsNum || setsNum <= 0) return;

		// Find existing exercise by name or create new one
		const existing = exercises.find(
			e => e.name.toLowerCase() === trimmed.toLowerCase()
		);

		if (existing) {
			onAdd(existing.id, setsNum, reps ? parseInt(reps, 10) : undefined);
			setName('');
			setSets('3');
			setReps('');
		} else {
			addExerciseMutation.mutate(
				{name: trimmed},
				{
					onSuccess: (newExercise) => {
						onAdd(newExercise.id, setsNum, reps ? parseInt(reps, 10) : undefined);
						setName('');
						setSets('3');
						setReps('');
					}
				}
			);
		}
	};

	return (
		<>
			<datalist id="exercise-suggestions">
				{exercises.map(e => (
					<option key={e.id} value={e.name} />
				))}
			</datalist>
			<div
				style={{
					display: 'flex',
					gap: '8px',
					flexWrap: 'wrap',
					alignItems: 'flex-end'
				}}>
				<Field style={{flex: '3 1 180px'}}>
					<Field.Label>Exercise name</Field.Label>
					<Field.Input
						type="text"
						list="exercise-suggestions"
						value={name}
						placeholder="e.g. Bench Press"
						onChange={e => setName(e.target.value)}
						onKeyDown={e => e.key === 'Enter' && handleAdd()}
					/>
				</Field>
				<Field style={{flex: '1 1 70px'}}>
					<Field.Label>Sets</Field.Label>
					<Field.Input
						type="number"
						value={sets}
						min="1"
						step="1"
						onChange={e => setSets(e.target.value)}
					/>
				</Field>
				<Field style={{flex: '1 1 80px'}}>
					<Field.Label>Reps (opt.)</Field.Label>
					<Field.Input
						type="number"
						value={reps}
						placeholder="—"
						min="1"
						step="1"
						onChange={e => setReps(e.target.value)}
						onKeyDown={e => e.key === 'Enter' && handleAdd()}
					/>
				</Field>
				<Button
					variant="secondary"
					onClick={handleAdd}
					disabled={!name.trim() || !sets}
					style={{alignSelf: 'flex-end'}}>
					+ Add
				</Button>
			</div>
		</>
	);
}
