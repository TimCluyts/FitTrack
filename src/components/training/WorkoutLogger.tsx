import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import {Field} from '../ui/Field';
import {WorkoutExercisePanel} from './WorkoutExercisePanel';
import {useWorkoutLogger} from '../../hooks/useWorkoutLogger';
import type {Routine} from '../../types/fitness';

interface WorkoutLoggerProps {
	routine: Routine;
	onSave: () => void;
	onCancel: () => void;
}

export function WorkoutLogger({routine, onSave, onCancel}: WorkoutLoggerProps) {
	const logger = useWorkoutLogger(routine);

	const handleSave = () => {
		if (logger.save()) onSave();
	};

	return (
		<Card>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexWrap: 'wrap',
					gap: '12px',
					marginBottom: '20px'
				}}>
				<div
					style={{
						fontWeight: 600,
						fontSize: '15px',
						color: '#1b4332'
					}}>
					{routine.name}
				</div>
				<Field style={{margin: 0}}>
					<Field.Input
						type="date"
						value={logger.date}
						onChange={e => logger.setDate(e.target.value)}
					/>
				</Field>
			</div>

			<div
				style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
				{logger.draft.map((de, exIdx) => (
					<WorkoutExercisePanel
						key={de.exerciseId}
						name={logger.exerciseName(de.exerciseId)}
						lastSets={logger.lastSets(de.exerciseId)}
						sets={de.sets}
						onUpdateSet={(setIdx, field, value) =>
							logger.updateSet(exIdx, setIdx, field, value)
						}
						onAddSet={() => logger.addSet(exIdx)}
						onRemoveSet={setIdx => logger.removeSet(exIdx, setIdx)}
					/>
				))}
			</div>

			<div
				style={{
					marginTop: '24px',
					paddingTop: '16px',
					borderTop: '1px solid #e8f0e9',
					display: 'flex',
					gap: '8px'
				}}>
				<Button disabled={!logger.canSave} onClick={handleSave}>
					Save Workout
				</Button>
				<Button variant="outline" onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</Card>
	);
}
