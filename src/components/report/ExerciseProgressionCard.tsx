import {useState} from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer
} from 'recharts';
import {Card} from '../ui/Card';
import {Field} from '../ui/Field';
import {AXIS_TICK, CHART_TITLE, TOOLTIP_CS} from './chartStyles';
import type {Exercise, WorkoutLog} from '../../types/fitness';

interface ExerciseProgressionCardProps {
	exercises: Exercise[];
	workoutLogs: WorkoutLog[];
}

export function ExerciseProgressionCard({
	exercises,
	workoutLogs
}: ExerciseProgressionCardProps) {
	const [exerciseId, setExerciseId] = useState('');

	const progressData = exerciseId
		? [...workoutLogs]
				.filter(l => l.exercises.some(e => e.exerciseId === exerciseId))
				.sort((a, b) => a.date.localeCompare(b.date))
				.map(l => {
					const ex = l.exercises.find(e => e.exerciseId === exerciseId)!;
					return {
						maxWeight: Math.max(...ex.sets.map(s => s.weight)),
						label: l.date.slice(5).replace('-', '/')
					};
				})
		: [];

	return (
		<Card>
			<div style={CHART_TITLE}>Exercise progression</div>
			<Field style={{maxWidth: '280px', marginBottom: '16px'}}>
				<Field.Select
					value={exerciseId}
					onChange={e => setExerciseId(e.target.value)}>
					<option value="">Select exercise…</option>
					{[...exercises]
						.sort((a, b) => a.name.localeCompare(b.name))
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
						margin={{top: 4, right: 12, left: 0, bottom: 4}}>
						<CartesianGrid strokeDasharray="3 3" stroke="#e8f0e9" />
						<XAxis dataKey="label" tick={AXIS_TICK} />
						<YAxis tick={AXIS_TICK} width={48} domain={['auto', 'auto']} />
						<Tooltip
							contentStyle={TOOLTIP_CS}
							formatter={v => [`${v} kg`, 'Max weight']}
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
			) : exerciseId ? (
				<div style={{color: '#a0aec0', fontSize: '13px'}}>
					No workout logs for this exercise yet.
				</div>
			) : null}
		</Card>
	);
}
