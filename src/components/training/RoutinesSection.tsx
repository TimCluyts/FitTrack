import {useDeleteRoutine} from '../../hooks/useApi';
import {RoutineCard} from './RoutineCard';
import {Card} from '../ui/Card';
import type {Routine} from '../../types/fitness';
import type {TrainingMode} from '../../hooks/useTrainingMode';

interface RoutinesSectionProps {
	routines: Routine[];
	mode: TrainingMode;
	onStart: (routineId: string) => void;
	onEdit: (routineId: string) => void;
}

export function RoutinesSection({routines, mode, onStart, onEdit}: RoutinesSectionProps) {
	const deleteRoutine = useDeleteRoutine();

	if (routines.length === 0 && mode.view === 'overview') {
		return (
			<Card
				style={{
					textAlign: 'center',
					padding: '48px 24px',
					color: '#a0aec0'
				}}>
				No routines yet. Create your first one above.
			</Card>
		);
	}

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
			{routines.map(routine => (
				<RoutineCard
					key={routine.id}
					routine={routine}
					dimmed={
						mode.view === 'editRoutine' && mode.routineId !== routine.id
					}
					onStart={() => onStart(routine.id)}
					onEdit={() => onEdit(routine.id)}
					onDelete={() => {
						if (confirm(`Delete "${routine.name}"?`))
							deleteRoutine.mutate(routine.id);
					}}
				/>
			))}
		</div>
	);
}
