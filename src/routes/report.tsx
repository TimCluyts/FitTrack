import {createFileRoute} from '@tanstack/react-router';
import {useMemo} from 'react';
import {
	useProducts,
	useRecipes,
	useLogEntries,
	useWeightEntries,
	useExercises,
	useWorkoutLogs,
	useRunLogs
} from '../hooks/useApi';
import {getEntryMacros, sumMacros} from '../utils/macros';
import {Card} from '../components/ui/Card';
import {PageHeader} from '../components/ui/PageHeader';
import {CaloriesPerDayCard} from '../components/report/CaloriesPerDayCard';
import {MacrosPerDayCard} from '../components/report/MacrosPerDayCard';
import {NutritionSummaryCard} from '../components/report/NutritionSummaryCard';
import {BodyWeightCard} from '../components/report/BodyWeightCard';
import {RecentWorkoutsCard} from '../components/report/RecentWorkoutsCard';
import {ExerciseProgressionCard} from '../components/report/ExerciseProgressionCard';
import {RunDistanceCard} from '../components/report/RunDistanceCard';
import {RunSpeedCard} from '../components/report/RunSpeedCard';
import {RunHistoryCard} from '../components/report/RunHistoryCard';
import type {MacroTotals} from '../types/fitness';

export const Route = createFileRoute('/report')({
	component: ReportPage
});

function ReportPage() {
	const {data: products = []} = useProducts();
	const {data: recipes = []} = useRecipes();
	const {data: logEntries = []} = useLogEntries();
	const {data: weightEntries = []} = useWeightEntries();
	const {data: exercises = []} = useExercises();
	const {data: workoutLogs = []} = useWorkoutLogs();
	const {data: runLogs = []} = useRunLogs();

	const {allDays, chartDays} = useMemo(() => {
		const dayMap = new Map<string, MacroTotals>();
		for (const entry of logEntries) {
			const macros = getEntryMacros(entry, products, recipes);
			if (!macros) continue;
			const prev = dayMap.get(entry.date) ?? {kcal: 0, protein: 0, fat: 0, carbs: 0};
			dayMap.set(entry.date, sumMacros([prev, macros]));
		}
		const allDays = [...dayMap.entries()]
			.map(([date, totals]) => ({date, ...totals}))
			.sort((a, b) => a.date.localeCompare(b.date));
		const chartDays = allDays
			.slice(-30)
			.map(d => ({...d, label: d.date.slice(5).replace('-', '/')}));
		return {allDays, chartDays};
	}, [logEntries, products, recipes]);

	const runChartData = useMemo(
		() =>
			[...runLogs]
				.sort((a, b) => a.date.localeCompare(b.date))
				.slice(-30)
				.map(r => ({
					distanceKm: r.distanceKm,
					speedKmh: r.speedKmh ?? null,
					label: r.date.slice(5).replace('-', '/')
				})),
		[runLogs]
	);

	const hasNutrition = allDays.length > 0;
	const hasWeight = weightEntries.length > 0;
	const hasTraining = workoutLogs.length > 0;
	const hasRunning = runLogs.length > 0;

	if (!hasNutrition && !hasWeight && !hasTraining && !hasRunning) {
		return (
			<Card style={{textAlign: 'center', padding: '60px 24px'}}>
				<div style={{color: '#a0aec0', fontSize: '16px'}}>No data yet</div>
				<div style={{color: '#cbd5e0', fontSize: '13px', marginTop: '6px'}}>
					Start logging to see your report here.
				</div>
			</Card>
		);
	}

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
			<PageHeader title="Report" />

			{hasNutrition && (
				<>
					<CaloriesPerDayCard data={chartDays} />
					<MacrosPerDayCard data={chartDays} />
					<NutritionSummaryCard days={allDays} />
				</>
			)}

			{hasWeight && <BodyWeightCard entries={weightEntries} />}

			{hasTraining && (
				<>
					<RecentWorkoutsCard workoutLogs={workoutLogs} />
					{exercises.length > 0 && (
						<ExerciseProgressionCard
							exercises={exercises}
							workoutLogs={workoutLogs}
						/>
					)}
				</>
			)}

			{hasRunning && (
				<>
					<RunDistanceCard data={runChartData} firstRun={runLogs[0]} />
					{runChartData.some(r => r.speedKmh != null) && (
						<RunSpeedCard data={runChartData} />
					)}
					<RunHistoryCard runLogs={runLogs} />
				</>
			)}
		</div>
	);
}
