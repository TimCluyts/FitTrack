import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import type {Exercise, WorkoutLog} from '../../types/fitness';

interface WorkoutLogCardProps {
	log: WorkoutLog;
	exercises: Exercise[];
	onDelete: () => void;
}

export function WorkoutLogCard({log, exercises, onDelete}: WorkoutLogCardProps) {
	const totalSets = log.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
	const totalVolume = log.exercises.reduce(
		(acc, ex) => acc + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0),
		0
	);

	return (
		<Card>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					gap: '10px',
					flexWrap: 'wrap'
				}}>
				<div>
					<div
						style={{
							fontWeight: 600,
							fontSize: '15px',
							color: '#1b4332',
							marginBottom: '2px'
						}}>
						{log.routineName}
					</div>
					<div style={{fontSize: '13px', color: '#718096'}}>
						{log.date} · {totalSets} sets ·{' '}
						{Math.round(totalVolume).toLocaleString()} kg total volume
					</div>
				</div>
				<Button
					variant="ghost-danger"
					size="sm"
					onClick={onDelete}
					style={{fontSize: '16px', padding: '2px 6px', lineHeight: 1}}
					title="Delete">
					×
				</Button>
			</div>
			<div
				style={{
					marginTop: '10px',
					display: 'flex',
					flexDirection: 'column',
					gap: '4px'
				}}>
				{log.exercises.map(ex => {
					const name =
						exercises.find(e => e.id === ex.exerciseId)?.name ?? 'Unknown exercise';
					const setsText = ex.sets.map(s => `${s.weight}×${s.reps}`).join(' · ');
					return (
						<div key={ex.exerciseId} style={{fontSize: '13px'}}>
							<span style={{fontWeight: 600, color: '#2d6a4f'}}>{name}</span>
							<span style={{color: '#718096'}}> — {setsText}</span>
						</div>
					);
				})}
			</div>
		</Card>
	);
}
