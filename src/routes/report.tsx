import {createFileRoute} from '@tanstack/react-router';
import {useState} from 'react';
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from 'recharts';
import {useNutritionStore} from '../store/nutritionStore';
import {useLogStore} from '../store/logStore';
import {useWeightStore} from '../store/weightStore';
import {useTrainingStore} from '../store/trainingStore';
import {getEntryMacros, sumMacros} from '../utils/macros';
import {Card} from '../components/ui/Card';
import {DataTable} from '../components/ui/DataTable';
import {Field} from '../components/ui/Field';
import {PageHeader} from '../components/ui/PageHeader';
import type {MacroTotals} from '../types/fitness';

export const Route = createFileRoute('/report')({
	component: ReportPage
});

const CHART_TITLE = {
	fontWeight: 600,
	fontSize: '15px',
	color: '#1b4332',
	marginBottom: '16px'
} as const;
const AXIS_TICK = {fontSize: 11, fill: '#718096'} as const;
const TOOLTIP_CS = {
	fontSize: '13px',
	borderRadius: '6px',
	border: '1px solid #e2e8f0'
} as const;

const NUTRITION_COLS = [
	{label: 'Date', align: 'left' as const},
	{label: 'Kcal', align: 'right' as const},
	{label: 'Protein', align: 'right' as const},
	{label: 'Fat', align: 'right' as const},
	{label: 'Carbs', align: 'right' as const}
];

const WORKOUT_COLS = [
	{label: 'Date', align: 'left' as const},
	{label: 'Routine', align: 'left' as const},
	{label: 'Sets', align: 'right' as const},
	{label: 'Volume (kg)', align: 'right' as const}
];

function ReportPage() {
	const {products, recipes} = useNutritionStore();
	const {logEntries} = useLogStore();
	const {weightEntries} = useWeightStore();
	const {exercises, workoutLogs} = useTrainingStore();

	// ── Nutrition ──────────────────────────────────────────────────
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
	const chartDays = allDays.slice(-30).map(d => ({
		...d,
		label: d.date.slice(5).replace('-', '/')
	}));

	// ── Weight ─────────────────────────────────────────────────────
	const sortedWeight = [...weightEntries]
		.sort((a, b) => a.date.localeCompare(b.date))
		.slice(-60)
		.map(e => ({weight: e.weight, label: e.date.slice(5).replace('-', '/')}));

	// ── Training ───────────────────────────────────────────────────
	const sortedLogs = [...workoutLogs].sort((a, b) =>
		b.date.localeCompare(a.date)
	);

	const [progressExerciseId, setProgressExerciseId] = useState('');
	const progressData = progressExerciseId
		? [...workoutLogs]
				.filter(l =>
					l.exercises.some(e => e.exerciseId === progressExerciseId)
				)
				.sort((a, b) => a.date.localeCompare(b.date))
				.map(l => {
					const ex = l.exercises.find(
						e => e.exerciseId === progressExerciseId
					)!;
					const maxWeight = Math.max(...ex.sets.map(s => s.weight));
					return {
						maxWeight,
						label: l.date.slice(5).replace('-', '/')
					};
				})
		: [];

	const hasNutrition = allDays.length > 0;
	const hasWeight = weightEntries.length > 0;
	const hasTraining = workoutLogs.length > 0;

	if (!hasNutrition && !hasWeight && !hasTraining) {
		return (
			<Card style={{textAlign: 'center', padding: '60px 24px'}}>
				<div style={{color: '#a0aec0', fontSize: '16px'}}>
					No data yet
				</div>
				<div
					style={{
						color: '#cbd5e0',
						fontSize: '13px',
						marginTop: '6px'
					}}>
					Start logging to see your report here.
				</div>
			</Card>
		);
	}

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
			<PageHeader title="Report" />

			{/* ── Nutrition ── */}
			{hasNutrition && (
				<>
					<Card>
						<div style={CHART_TITLE}>Calories per day</div>
						<ResponsiveContainer width="100%" height={240}>
							<BarChart
								data={chartDays}
								margin={{top: 4, right: 12, left: 0, bottom: 4}}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#e8f0e9"
								/>
								<XAxis dataKey="label" tick={AXIS_TICK} />
								<YAxis tick={AXIS_TICK} width={48} />
								<Tooltip
									contentStyle={TOOLTIP_CS}
									formatter={v => [`${v ?? 0} kcal`, 'Calories']}
								/>
								<Bar
									dataKey="kcal"
									name="Kcal"
									fill="#2d6a4f"
									radius={[3, 3, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</Card>

					<Card>
						<div style={CHART_TITLE}>Macros per day (g)</div>
						<ResponsiveContainer width="100%" height={220}>
							<BarChart
								data={chartDays}
								margin={{top: 4, right: 12, left: 0, bottom: 4}}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#e8f0e9"
								/>
								<XAxis dataKey="label" tick={AXIS_TICK} />
								<YAxis tick={AXIS_TICK} width={48} />
								<Tooltip
									contentStyle={TOOLTIP_CS}
									formatter={(v, name) => [
										`${v ?? 0}g`,
										String(name)
									]}
								/>
								<Legend wrapperStyle={{fontSize: '12px'}} />
								<Bar
									dataKey="protein"
									name="Protein"
									fill="#48bb78"
									stackId="macros"
								/>
								<Bar
									dataKey="carbs"
									name="Carbs"
									fill="#4299e1"
									stackId="macros"
								/>
								<Bar
									dataKey="fat"
									name="Fat"
									fill="#ed8936"
									stackId="macros"
									radius={[3, 3, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</Card>

					<Card>
						<div style={CHART_TITLE}>Day-by-day summary</div>
						<DataTable columns={NUTRITION_COLS} minWidth={400}>
							{[...allDays].reverse().map(d => (
								<DataTable.Row key={d.date}>
									<DataTable.Cell>{d.date}</DataTable.Cell>
									<DataTable.Cell align="right">
										{d.kcal}
									</DataTable.Cell>
									<DataTable.Cell align="right">
										{d.protein}g
									</DataTable.Cell>
									<DataTable.Cell align="right">
										{d.fat}g
									</DataTable.Cell>
									<DataTable.Cell align="right">
										{d.carbs}g
									</DataTable.Cell>
								</DataTable.Row>
							))}
						</DataTable>
					</Card>
				</>
			)}

			{/* ── Weight ── */}
			{hasWeight && (
				<Card>
					<div style={CHART_TITLE}>Body weight (kg)</div>
					{sortedWeight.length > 1 ? (
						<ResponsiveContainer width="100%" height={220}>
							<LineChart
								data={sortedWeight}
								margin={{top: 4, right: 12, left: 0, bottom: 4}}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#e8f0e9"
								/>
								<XAxis dataKey="label" tick={AXIS_TICK} />
								<YAxis
									tick={AXIS_TICK}
									width={48}
									domain={['auto', 'auto']}
								/>
								<Tooltip
									contentStyle={TOOLTIP_CS}
									formatter={v => [`${v} kg`, 'Weight']}
								/>
								<Line
									type="monotone"
									dataKey="weight"
									stroke="#2d6a4f"
									strokeWidth={2}
									dot={{r: 3, fill: '#2d6a4f'}}
									activeDot={{r: 5}}
								/>
							</LineChart>
						</ResponsiveContainer>
					) : (
						<div style={{color: '#a0aec0', fontSize: '13px'}}>
							{weightEntries[0].weight} kg on {weightEntries[0].date}
						</div>
					)}
				</Card>
			)}

			{/* ── Training ── */}
			{hasTraining && (
				<>
					<Card>
						<div style={CHART_TITLE}>Recent workouts</div>
						<DataTable columns={WORKOUT_COLS} minWidth={400}>
							{sortedLogs.slice(0, 20).map(log => {
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
									<DataTable.Row key={log.id}>
										<DataTable.Cell>
											{log.date}
										</DataTable.Cell>
										<DataTable.Cell>
											{log.routineName}
										</DataTable.Cell>
										<DataTable.Cell align="right">
											{totalSets}
										</DataTable.Cell>
										<DataTable.Cell align="right">
											{Math.round(totalVolume).toLocaleString()}
										</DataTable.Cell>
									</DataTable.Row>
								);
							})}
						</DataTable>
					</Card>

					{exercises.length > 0 && (
						<Card>
							<div style={CHART_TITLE}>Exercise progression</div>
							<Field style={{maxWidth: '280px', marginBottom: '16px'}}>
								<Field.Select
									value={progressExerciseId}
									onChange={e =>
										setProgressExerciseId(e.target.value)
									}>
									<option value="">Select exercise…</option>
									{[...exercises]
										.sort((a, b) =>
											a.name.localeCompare(b.name)
										)
										.map(e => (
											<option key={e.id} value={e.id}>
												{e.name}
											</option>
										))}
								</Field.Select>
							</Field>
							{progressData.length > 0 ? (
								<ResponsiveContainer width="100%" height={220}>
									<LineChart
										data={progressData}
										margin={{
											top: 4,
											right: 12,
											left: 0,
											bottom: 4
										}}>
										<CartesianGrid
											strokeDasharray="3 3"
											stroke="#e8f0e9"
										/>
										<XAxis
											dataKey="label"
											tick={AXIS_TICK}
										/>
										<YAxis
											tick={AXIS_TICK}
											width={48}
											domain={['auto', 'auto']}
										/>
										<Tooltip
											contentStyle={TOOLTIP_CS}
											formatter={v => [
												`${v} kg`,
												'Max weight'
											]}
										/>
										<Line
											type="monotone"
											dataKey="maxWeight"
											stroke="#48bb78"
											strokeWidth={2}
											dot={{r: 3, fill: '#48bb78'}}
											activeDot={{r: 5}}
										/>
									</LineChart>
								</ResponsiveContainer>
							) : progressExerciseId ? (
								<div
									style={{
										color: '#a0aec0',
										fontSize: '13px'
									}}>
									No workout logs for this exercise yet.
								</div>
							) : null}
						</Card>
					)}
				</>
			)}
		</div>
	);
}
