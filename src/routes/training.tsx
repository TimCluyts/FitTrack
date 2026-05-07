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
import {Card} from '../components/ui/Card';
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
		handleStartWorkout,
		handleResumeSession,
		session,
		clearSession,
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
					onBack={() => setMode({view: 'overview'})}
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
						<Button onClick={() => setMode({view: 'editRoutine', routineId: 'new'})}>
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

			{mode.view === 'overview' && session && (
				<Card>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							flexWrap: 'wrap',
							gap: '12px'
						}}>
						<div>
							<div style={{fontWeight: 600, fontSize: '14px', color: '#1b4332'}}>
								Active session: {session.routineName}
							</div>
							<div style={{fontSize: '12px', color: '#718096', marginTop: '2px'}}>
								{session.doneExerciseIds.length}/{session.draft.length} exercises done
							</div>
						</div>
						<div style={{display: 'flex', gap: '8px'}}>
							<Button onClick={handleResumeSession}>Resume</Button>
							<Button variant="outline" onClick={clearSession}>
								Discard
							</Button>
						</div>
					</div>
				</Card>
			)}

			<RoutinesSection
				routines={routines}
				mode={mode}
				onStart={handleStartWorkout}
				onEdit={id => setMode({view: 'editRoutine', routineId: id})}
			/>

			{mode.view === 'overview' && <PersonalRecordsSection />}
			{mode.view === 'overview' && <WorkoutHistorySection />}
			{mode.view === 'overview' && <RunHistorySection />}
		</div>
	);
}
