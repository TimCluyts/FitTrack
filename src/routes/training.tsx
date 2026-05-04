import {createFileRoute} from '@tanstack/react-router';
import {useTrainingMode} from '../hooks/useTrainingMode';
import {RoutineEditor} from '../components/training/RoutineEditor';
import {RoutinesSection} from '../components/training/RoutinesSection';
import {WorkoutLogger} from '../components/training/WorkoutLogger';
import {RunLogger} from '../components/training/RunLogger';
import {PersonalRecordsSection} from '../components/training/PersonalRecordsSection';
import {WorkoutHistorySection} from '../components/training/WorkoutHistorySection';
import {RunHistorySection} from '../components/training/RunHistorySection';
import {Button} from '../components/ui/Button';
import {PageHeader} from '../components/ui/PageHeader';

export const Route = createFileRoute('/training')({
	component: TrainingPage
});

function TrainingPage() {
	const {
		mode,
		setMode,
		routines,
		editingRoutine,
		loggingRoutine,
		handleSaveRoutine,
		showRunForm,
		toggleRunForm,
		closeRunForm
	} = useTrainingMode();

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

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
			<PageHeader title="Training">
				{mode.view === 'overview' && (
					<div style={{display: 'flex', gap: '8px'}}>
						<Button variant="outline" onClick={toggleRunForm}>
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
				<RunLogger onSave={closeRunForm} onCancel={closeRunForm} />
			)}

			<RoutinesSection
				routines={routines}
				mode={mode}
				onStart={id => setMode({view: 'logWorkout', routineId: id})}
				onEdit={id => setMode({view: 'editRoutine', routineId: id})}
			/>

			{mode.view === 'overview' && <PersonalRecordsSection />}
			{mode.view === 'overview' && <WorkoutHistorySection />}
			{mode.view === 'overview' && <RunHistorySection />}
		</div>
	);
}
