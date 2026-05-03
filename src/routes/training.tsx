import {createFileRoute} from '@tanstack/react-router';
import {useMemo, useState} from 'react';
import {formatPace} from '../utils/pace';
import {
	useRoutines,
	useExercises,
	useWorkoutLogs,
	useRunLogs,
	useAddRoutine,
	useUpdateRoutine,
	useDeleteRoutine,
	useDeleteWorkoutLog,
	useDeleteRunLog
} from '../hooks/useApi';
import {RoutineEditor} from '../components/training/RoutineEditor';
import {RoutineCard} from '../components/training/RoutineCard';
import {WorkoutLogger} from '../components/training/WorkoutLogger';
import {RunLogger} from '../components/training/RunLogger';
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
	const {data: exercises = []} = useExercises();
	const {data: routines = []} = useRoutines();
	const {data: workoutLogs = []} = useWorkoutLogs();
	const {data: runLogs = []} = useRunLogs();
	const addRoutine = useAddRoutine();
	const updateRoutine = useUpdateRoutine();
	const deleteRoutine = useDeleteRoutine();
	const deleteWorkoutLog = useDeleteWorkoutLog();
	const deleteRunLog = useDeleteRunLog();

	const [mode, setMode] = useState<Mode>({view: 'overview'});
	const [showRunForm, setShowRunForm] = useState(false);

	const handleSaveRoutine = (
		name: string,
		routineExercises: RoutineExercise[]
	) => {
		if (mode.view !== 'editRoutine') return;
		if (mode.routineId === 'new') {
			addRoutine.mutate({name, exercises: routineExercises});
		} else {
			updateRoutine.mutate({id: mode.routineId, data: {name, exercises: routineExercises}});
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

	const sortedWorkoutLogs = useMemo(
		() => [...workoutLogs].sort((a, b) => b.date.localeCompare(a.date)),
		[workoutLogs]
	);
	const sortedRunLogs = useMemo(
		() => [...runLogs].sort((a, b) => b.date.localeCompare(a.date)),
		[runLogs]
	);

	const weightPRs = useMemo(() => {
		// Single pass: build exerciseId → maxWeight map, then join with exercise names.
		const maxByExercise = new Map<string, number>();
		for (const log of workoutLogs) {
			for (const ex of log.exercises) {
				const curr = maxByExercise.get(ex.exerciseId) ?? 0;
				for (const set of ex.sets) {
					if (set.weight > curr) maxByExercise.set(ex.exerciseId, set.weight);
				}
			}
		}
		return exercises
			.flatMap(ex => {
				const weight = maxByExercise.get(ex.id);
				return weight != null ? [{name: ex.name, weight}] : [];
			})
			.sort((a, b) => a.name.localeCompare(b.name));
	}, [exercises, workoutLogs]);

	const {prDistance, prSpeed, prPaceVal} = useMemo(() => {
		if (!runLogs.length) return {prDistance: null, prSpeed: null, prPaceVal: null};
		let prDistance: number | null = null;
		let prSpeed: number | null = null;
		let prPaceVal: number | null = null;
		for (const r of runLogs) {
			if (prDistance === null || r.distanceKm > prDistance) prDistance = r.distanceKm;
			if (r.speedKmh != null && (prSpeed === null || r.speedKmh > prSpeed)) prSpeed = r.speedKmh;
			if (r.durationMin != null && r.distanceKm > 0) {
				const pace = r.durationMin / r.distanceKm;
				if (prPaceVal === null || pace < prPaceVal) prPaceVal = pace;
			}
		}
		return {prDistance, prSpeed, prPaceVal};
	}, [runLogs]);

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
			<PageHeader title="Training">
				{mode.view === 'overview' && (
					<div style={{display: 'flex', gap: '8px'}}>
						<Button
							variant="outline"
							onClick={() => {
								setShowRunForm(v => !v);
								setMode({view: 'overview'});
							}}>
							🏃 Log Run
						</Button>
						<Button
							onClick={() =>
								setMode({view: 'editRoutine', routineId: 'new'})
							}>
							+ New Routine
						</Button>
					</div>
				)}
			</PageHeader>

			{mode.view === 'editRoutine' && (
				<RoutineEditor
					initial={editingRoutine}
					onSave={handleSaveRoutine}
					onCancel={() => setMode({view: 'overview'})}
				/>
			)}

			{showRunForm && mode.view === 'overview' && (
				<RunLogger
					onSave={() => setShowRunForm(false)}
					onCancel={() => setShowRunForm(false)}
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
									deleteRoutine.mutate(routine.id);
							}}
						/>
					))}
				</div>
			)}

			{/* Weight PRs */}
			{weightPRs.length > 0 && mode.view === 'overview' && (
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
						Personal Records
					</div>
					<Card>
						<div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
							{weightPRs.map(pr => (
								<span
									key={pr.name}
									style={{
										fontSize: '13px',
										background: '#fffbeb',
										color: '#92400e',
										border: '1px solid #fde68a',
										borderRadius: '4px',
										padding: '4px 10px',
										fontWeight: 500
									}}>
									🏆 {pr.name}: {pr.weight} kg
								</span>
							))}
						</div>
					</Card>
				</>
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
										onClick={() => deleteWorkoutLog.mutate(log.id)}
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

			{/* Run history */}
			{sortedRunLogs.length > 0 && mode.view === 'overview' && (
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
						Run History
					</div>
					{sortedRunLogs.slice(0, 20).map(log => {
						const pace =
							log.durationMin != null && log.distanceKm > 0
								? log.durationMin / log.distanceKm
								: null;
						const isPRDist = log.distanceKm === prDistance;
						const isPRSpeed =
							log.speedKmh != null && log.speedKmh === prSpeed;
						const isPRPace =
							pace != null &&
							prPaceVal != null &&
							Math.abs(pace - prPaceVal) < 0.001;
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
												marginBottom: '2px',
												display: 'flex',
												alignItems: 'center',
												gap: '6px'
											}}>
											{log.distanceKm} km
											{isPRDist && (
												<span
													title="Personal record distance"
													style={{
														fontSize: '11px',
														background: '#fffbeb',
														color: '#92400e',
														border: '1px solid #fde68a',
														borderRadius: '4px',
														padding: '1px 6px',
														fontWeight: 700
													}}>
													🏆 PR afstand
												</span>
											)}
										</div>
										<div
											style={{
												fontSize: '13px',
												color: '#718096',
												display: 'flex',
												flexWrap: 'wrap',
												gap: '6px',
												alignItems: 'center'
											}}>
											<span>{log.date}</span>
											{log.durationMin != null && (
												<span>· {log.durationMin} min</span>
											)}
											{log.speedKmh != null && (
												<span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
													· {log.speedKmh} km/h
													{isPRSpeed && (
														<span
															title="Personal record speed"
															style={{
																fontSize: '11px',
																background: '#fffbeb',
																color: '#92400e',
																border: '1px solid #fde68a',
																borderRadius: '4px',
																padding: '1px 5px',
																fontWeight: 700
															}}>
															🏆 PR
														</span>
													)}
												</span>
											)}
											{pace != null && (
												<span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
													· {formatPace(pace)}
													{isPRPace && (
														<span
															title="Personal record pace"
															style={{
																fontSize: '11px',
																background: '#fffbeb',
																color: '#92400e',
																border: '1px solid #fde68a',
																borderRadius: '4px',
																padding: '1px 5px',
																fontWeight: 700
															}}>
															🏆 PR
														</span>
													)}
												</span>
											)}
											{log.kcal != null && (
												<span>· {log.kcal} kcal</span>
											)}
											{log.note && <span>· {log.note}</span>}
										</div>
									</div>
									<Button
										variant="ghost-danger"
										size="sm"
										onClick={() => deleteRunLog.mutate(log.id)}
										style={{
											fontSize: '16px',
											padding: '2px 6px',
											lineHeight: 1
										}}
										title="Delete">
										×
									</Button>
								</div>
							</Card>
						);
					})}
			{(prDistance != null || prSpeed != null || prPaceVal != null) &&
				mode.view === 'overview' && (
					<Card>
						<div
							style={{
								fontWeight: 600,
								fontSize: '13px',
								color: '#1b4332',
								textTransform: 'uppercase',
								letterSpacing: '0.04em',
								marginBottom: '10px'
							}}>
							🏆 Run Records
						</div>
						<div style={{display: 'flex', flexWrap: 'wrap', gap: '16px'}}>
							{prDistance != null && (
								<div>
									<div style={{fontSize: '20px', fontWeight: 700, color: '#1b4332'}}>
										{prDistance} km
									</div>
									<div style={{fontSize: '11px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
										Longest run
									</div>
								</div>
							)}
							{prSpeed != null && (
								<div>
									<div style={{fontSize: '20px', fontWeight: 700, color: '#1b4332'}}>
										{prSpeed} km/h
									</div>
									<div style={{fontSize: '11px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
										Fastest speed
									</div>
								</div>
							)}
							{prPaceVal != null && (
								<div>
									<div style={{fontSize: '20px', fontWeight: 700, color: '#1b4332'}}>
										{formatPace(prPaceVal)}
									</div>
									<div style={{fontSize: '11px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
										Best pace
									</div>
								</div>
							)}
						</div>
					</Card>
				)}
			</>
			)}
		</div>
	);
}
