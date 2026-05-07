import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import {Field} from '../ui/Field';
import {WorkoutExercisePanel} from './WorkoutExercisePanel';
import {useWorkoutLogger} from '../../hooks/useWorkoutLogger';
import type {Routine} from '../../types/fitness';

interface WorkoutLoggerProps {
	routine: Routine;
	onSave: () => void;
	onBack: () => void;
}

export function WorkoutLogger({routine, onSave, onBack}: Readonly<WorkoutLoggerProps>) {
	const logger = useWorkoutLogger(routine);

	const doneCount = logger.doneExerciseIds.length;
	const totalCount = logger.draft.length;

	const handleEndTraining = () => {
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
				<div>
					<div style={{fontWeight: 600, fontSize: '15px', color: '#1b4332'}}>
						{routine.name}
					</div>
					{totalCount > 0 && (
						<div style={{fontSize: '12px', color: '#718096', marginTop: '2px'}}>
							{doneCount}/{totalCount} exercises done
						</div>
					)}
				</div>
				<Field style={{margin: 0}}>
					<Field.Input
						type="date"
						value={logger.date}
						onChange={e => logger.setDate(e.target.value)}
					/>
				</Field>
			</div>

			<div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
				{logger.draft.map((de, exIdx) => (
					<WorkoutExercisePanel
						key={de.exerciseId}
						name={logger.exerciseName(de.exerciseId)}
						lastSets={logger.lastSets(de.exerciseId)}
						pr={logger.exercisePR(de.exerciseId)}
						progressBadge={logger.progressionHint(de.exerciseId)}
						sets={de.sets}
						isDone={logger.doneExerciseIds.includes(de.exerciseId)}
						onUpdateSet={(setIdx, field, value) =>
							logger.updateSet(exIdx, setIdx, field, value)
						}
						onAddSet={() => logger.addSet(exIdx)}
						onRemoveSet={setIdx => logger.removeSet(exIdx, setIdx)}
						onToggleDone={() => logger.markDone(de.exerciseId)}
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
				<Button disabled={!logger.canSave} onClick={handleEndTraining}>
					End Training
				</Button>
				<Button variant="outline" onClick={onBack}>
					Back
				</Button>
			</div>
		</Card>
	);
}
