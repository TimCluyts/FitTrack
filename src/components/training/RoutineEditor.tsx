import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import {Field} from '../ui/Field';
import {RoutineExerciseTable} from './RoutineExerciseTable';
import {useRoutineEditor} from '../../hooks/useRoutineEditor';
import type {Routine, RoutineExercise} from '../../types/fitness';

interface RoutineEditorProps {
	initial?: Routine;
	onSave: (name: string, exercises: RoutineExercise[]) => void;
	onCancel: () => void;
}

export function RoutineEditor({initial, onSave, onCancel}: RoutineEditorProps) {
	const {
		name,
		setName,
		exercises,
		addExercise,
		removeExercise,
		buildRoutineExercises,
		canSave
	} = useRoutineEditor(initial);

	return (
		<Card>
			<div
				style={{
					fontWeight: 600,
					fontSize: '15px',
					color: '#1b4332',
					marginBottom: '16px'
				}}>
				{initial ? 'Edit Routine' : 'New Routine'}
			</div>

			<Field style={{marginBottom: '16px', maxWidth: '380px'}}>
				<Field.Label>Routine name *</Field.Label>
				<Field.Input
					type="text"
					value={name}
					onChange={e => setName(e.target.value)}
					placeholder="e.g. Push A, Pull B"
					autoFocus
				/>
			</Field>

			<div
				style={{
					fontWeight: 600,
					fontSize: '13px',
					color: '#2d6a4f',
					textTransform: 'uppercase',
					letterSpacing: '0.04em',
					marginBottom: '10px'
				}}>
				Exercises
			</div>

			<RoutineExerciseTable
				exercises={exercises}
				onAdd={addExercise}
				onRemove={removeExercise}
			/>

			<div
				style={{
					display: 'flex',
					gap: '8px',
					marginTop: '16px'
				}}>
				<Button
					disabled={!canSave}
					onClick={() =>
						onSave(name.trim(), buildRoutineExercises())
					}>
					{initial ? 'Save Changes' : 'Create Routine'}
				</Button>
				<Button variant="outline" onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</Card>
	);
}
