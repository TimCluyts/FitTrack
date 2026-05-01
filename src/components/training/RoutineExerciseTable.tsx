import {Button} from '../ui/Button';
import {AddExerciseRow} from './AddExerciseRow';
import {useTrainingStore} from '../../store/trainingStore';
import type {LocalExercise} from '../../hooks/useRoutineEditor';

interface RoutineExerciseTableProps {
	exercises: LocalExercise[];
	onAdd: (exerciseId: string, targetSets: number, targetReps?: number) => void;
	onRemove: (idx: number) => void;
}

export function RoutineExerciseTable({
	exercises,
	onAdd,
	onRemove
}: RoutineExerciseTableProps) {
	const {exercises: storeExercises} = useTrainingStore();
	const exerciseName = (id: string) =>
		storeExercises.find(e => e.id === id)?.name ?? 'Unknown';

	return (
		<div>
			{exercises.length > 0 && (
				<div style={{marginBottom: '12px'}}>
					{exercises.map((le, idx) => (
						<div
							key={idx}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '12px',
								padding: '8px 0',
								borderBottom: '1px solid #f0f4f0'
							}}>
							<span
								style={{
									flex: 1,
									fontSize: '14px',
									color: '#1b4332'
								}}>
								{exerciseName(le.exerciseId)}
							</span>
							<span
								style={{
									fontSize: '13px',
									color: '#718096',
									minWidth: '80px'
								}}>
								{le.targetSets} sets
								{le.targetReps ? ` × ${le.targetReps}` : ''}
							</span>
							<Button
								variant="ghost-danger"
								size="sm"
								onClick={() => onRemove(idx)}
								style={{
									fontSize: '16px',
									padding: '2px 6px',
									lineHeight: 1
								}}>
								×
							</Button>
						</div>
					))}
				</div>
			)}

			<div
				style={{
					padding: '10px 0',
					borderTop:
						exercises.length > 0
							? '1px solid #e8f0e9'
							: undefined
				}}>
				<AddExerciseRow onAdd={onAdd} />
			</div>
		</div>
	);
}
