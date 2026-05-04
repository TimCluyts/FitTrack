import {createFileRoute} from '@tanstack/react-router';
import {useMemo, useState} from 'react';
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
import {WeightPRsCard} from '../components/training/WeightPRsCard';
import {WorkoutLogCard} from '../components/training/WorkoutLogCard';
import {RunLogCard} from '../components/training/RunLogCard';
import {RunRecordsCard} from '../components/training/RunRecordsCard';
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

const SECTION_LABEL = {
	fontWeight: 600,
	fontSize: '15px',
	color: '#2d6a4f',
	textTransform: 'uppercase' as const,
	letterSpacing: '0.04em',
	marginTop: '4px'
};

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

	const handleSaveRoutine = (name: string, routineExercises: RoutineExercise[]) => {
		if (mode.view !== 'editRoutine') return;
		if (mode.routineId === 'new') {
			addRoutine.mutate({name, exercises: routineExercises});
		} else {
			updateRoutine.mutate({
				id: mode.routineId,
				data: {name, exercises: routineExercises}
			});
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
				<PageHeader title="Log Workout" />
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
			if (r.speedKmh != null && (prSpeed === null || r.speedKmh > prSpeed))
				prSpeed = r.speedKmh;
			if (r.durationMin != null && r.distanceKm > 0) {
				const pace = r.durationMin / r.distanceKm;
				if (prPaceVal === null || pace < prPaceVal) prPaceVal = pace;
			}
		}
		return {prDistance, prSpeed, prPaceVal};
	}, [runLogs]);

	const hasRunRecords = prDistance != null || prSpeed != null || prPaceVal != null;

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
				<div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
					{routines.map(routine => (
						<RoutineCard
							key={routine.id}
							routine={routine}
							dimmed={
								mode.view === 'editRoutine' && mode.routineId !== routine.id
							}
							onStart={() =>
								setMode({view: 'logWorkout', routineId: routine.id})
							}
							onEdit={() =>
								setMode({view: 'editRoutine', routineId: routine.id})
							}
							onDelete={() => {
								if (confirm(`Delete "${routine.name}"?`))
									deleteRoutine.mutate(routine.id);
							}}
						/>
					))}
				</div>
			)}

			{weightPRs.length > 0 && mode.view === 'overview' && (
				<>
					<div style={SECTION_LABEL}>Personal Records</div>
					<WeightPRsCard prs={weightPRs} />
				</>
			)}

			{sortedWorkoutLogs.length > 0 && mode.view === 'overview' && (
				<>
					<div style={SECTION_LABEL}>Workout History</div>
					{sortedWorkoutLogs.slice(0, 20).map(log => (
						<WorkoutLogCard
							key={log.id}
							log={log}
							exercises={exercises}
							onDelete={() => deleteWorkoutLog.mutate(log.id)}
						/>
					))}
				</>
			)}

			{sortedRunLogs.length > 0 && mode.view === 'overview' && (
				<>
					<div style={SECTION_LABEL}>Run History</div>
					{sortedRunLogs.slice(0, 20).map(log => (
						<RunLogCard
							key={log.id}
							log={log}
							onDelete={() => deleteRunLog.mutate(log.id)}
							prDistance={prDistance}
							prSpeed={prSpeed}
							prPaceVal={prPaceVal}
						/>
					))}
					{hasRunRecords && (
						<RunRecordsCard
							prDistance={prDistance}
							prSpeed={prSpeed}
							prPaceVal={prPaceVal}
						/>
					)}
				</>
			)}
		</div>
	);
}
