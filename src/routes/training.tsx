import {createFileRoute} from '@tanstack/react-router';
import {useState} from 'react';
import {useTrainingStore} from '../store/trainingStore';
import {RoutineEditor} from '../components/training/RoutineEditor';
import {RoutineCard} from '../components/training/RoutineCard';
import {WorkoutLogger} from '../components/training/WorkoutLogger';
import {Button} from '../components/ui/Button';
import {Card} from '../components/ui/Card';
import {PageHeader} from '../components/ui/PageHeader';
import type {RoutineExercise} from '../types/fitness';

export const Route = createFileRoute('/training')({
	component: TrainingPage
});

type Mode =
	| {view: 'overview'}
	| {view: 'editRoutine'; routineId: string | 'new'}
	| {view: 'logWorkout'; routineId: string};

function TrainingPage() {
	const {
		exercises,
		routines,
		workoutLogs,
		addRoutine,
		updateRoutine,
		deleteRoutine,
		deleteWorkoutLog
	} = useTrainingStore();

	const [mode, setMode] = useState<Mode>({view: 'overview'});

	const handleSaveRoutine = (
		name: string,
		routineExercises: RoutineExercise[]
	) => {
		if (mode.view !== 'editRoutine') return;
		if (mode.routineId === 'new') {
			addRoutine({name, exercises: routineExercises});
		} else {
			updateRoutine(mode.routineId, {name, exercises: routineExercises});
		}
		setMode({view: 'overview'});
	};

	const editingRoutine =
		mode.view === 'editRoutine' && mode.routineId !== 'new'
			? routines.find(r => r.id === mode.routineId)
			: undefined;

	const loggingRoutine =
		mode.view === 'logWorkout'
			? routines.find(r => r.id === mode.routineId)
			: undefined;

	if (mode.view === 'logWorkout' && loggingRoutine) {
		return (
			<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
				<PageHeader title={`Log Workout`} />
				<WorkoutLogger
					routine={loggingRoutine}
					onSave={() => setMode({view: 'overview'})}
					onCancel={() => setMode({view: 'overview'})}
				/>
			</div>
		);
	}

	const sortedWorkoutLogs = [...workoutLogs].sort((a, b) =>
		b.date.localeCompare(a.date)
	);

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
			<PageHeader title="Training">
				{mode.view === 'overview' && (
					<Button
						onClick={() =>
							setMode({view: 'editRoutine', routineId: 'new'})
						}>
						+ New Routine
					</Button>
				)}
			</PageHeader>

			{mode.view === 'editRoutine' && (
				<RoutineEditor
					initial={editingRoutine}
					onSave={handleSaveRoutine}
					onCancel={() => setMode({view: 'overview'})}
				/>
			)}

			{/* Routines */}
			{routines.length === 0 && mode.view === 'overview' ? (
				<Card
					style={{
						textAlign: 'center',
						padding: '48px 24px',
						color: '#a0aec0'
					}}>
					No routines yet. Create your first one above.
				</Card>
			) : (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '12px'
					}}>
					{routines.map(routine => (
						<RoutineCard
							key={routine.id}
							routine={routine}
							dimmed={
								mode.view === 'editRoutine' &&
								mode.routineId !== routine.id
							}
							onStart={() =>
								setMode({
									view: 'logWorkout',
									routineId: routine.id
								})
							}
							onEdit={() =>
								setMode({
									view: 'editRoutine',
									routineId: routine.id
								})
							}
							onDelete={() => {
								if (
									confirm(
										`Delete "${routine.name}"?`
									)
								)
									deleteRoutine(routine.id);
							}}
						/>
					))}
				</div>
			)}

			{/* Workout history */}
			{sortedWorkoutLogs.length > 0 && mode.view === 'overview' && (
				<>
					<div
						style={{
							fontWeight: 600,
							fontSize: '15px',
							color: '#2d6a4f',
							textTransform: 'uppercase',
							letterSpacing: '0.04em',
							marginTop: '4px'
						}}>
						Workout History
					</div>
					{sortedWorkoutLogs.slice(0, 20).map(log => {
						const totalSets = log.exercises.reduce(
							(acc, ex) => acc + ex.sets.length,
							0
						);
						const totalVolume = log.exercises.reduce(
							(acc, ex) =>
								acc +
								ex.sets.reduce(
									(s, set) => s + set.weight * set.reps,
									0
								),
							0
						);
						return (
							<Card key={log.id}>
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
										<div
											style={{
												fontSize: '13px',
												color: '#718096'
											}}>
											{log.date} · {totalSets} sets ·{' '}
											{Math.round(totalVolume).toLocaleString()} kg total volume
										</div>
									</div>
									<Button
										variant="ghost-danger"
										size="sm"
										onClick={() => deleteWorkoutLog(log.id)}
										style={{
											fontSize: '16px',
											padding: '2px 6px',
											lineHeight: 1
										}}
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
											exercises.find(
												e => e.id === ex.exerciseId
											)?.name ?? 'Unknown exercise';
										const setsText = ex.sets
											.map(s => `${s.weight}×${s.reps}`)
											.join(' · ');
										return (
											<div
												key={ex.exerciseId}
												style={{fontSize: '13px'}}>
												<span
													style={{
														fontWeight: 600,
														color: '#2d6a4f'
													}}>
													{name}
												</span>
												<span
													style={{color: '#718096'}}>
													{' '}
													— {setsText}
												</span>
											</div>
										);
									})}
								</div>
							</Card>
						);
					})}
				</>
			)}
		</div>
	);
}
