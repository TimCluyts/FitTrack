import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import {useTrainingStore} from '../../store/trainingStore';
import type {Routine} from '../../types/fitness';

interface RoutineCardProps {
	routine: Routine;
	dimmed?: boolean;
	onEdit: () => void;
	onDelete: () => void;
	onStart: () => void;
}

export function RoutineCard({
	routine,
	dimmed,
	onEdit,
	onDelete,
	onStart
}: RoutineCardProps) {
	const {exercises} = useTrainingStore();

	const exerciseLines = routine.exercises.map(re => {
		const name = exercises.find(e => e.id === re.exerciseId)?.name ?? 'Unknown';
		const label = re.targetReps
			? `${re.targetSets} × ${re.targetReps}`
			: `${re.targetSets} sets`;
		return {name, label};
	});

	return (
		<Card style={{opacity: dimmed ? 0.5 : 1}}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					flexWrap: 'wrap',
					gap: '10px'
				}}>
				<div>
					<div
						style={{
							fontWeight: 600,
							fontSize: '16px',
							color: '#1b4332',
							marginBottom: '6px'
						}}>
						{routine.name}
					</div>
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: '6px'
						}}>
						{exerciseLines.map(({name, label}, i) => (
							<span
								key={i}
								style={{
									fontSize: '12px',
									background: '#f0f7f4',
									color: '#2d6a4f',
									borderRadius: '4px',
									padding: '3px 8px'
								}}>
								{name} — {label}
							</span>
						))}
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						gap: '8px',
						flexShrink: 0,
						flexWrap: 'wrap'
					}}>
					<Button
						variant="secondary"
						size="sm"
						onClick={onStart}
						disabled={routine.exercises.length === 0}>
						▶ Start
					</Button>
					<Button variant="outline" size="sm" onClick={onEdit}>
						Edit
					</Button>
					<Button
						variant="outline"
						size="sm"
						style={{color: '#c53030', borderColor: '#fca5a5'}}
						onClick={onDelete}>
						Delete
					</Button>
				</div>
			</div>
		</Card>
	);
}
