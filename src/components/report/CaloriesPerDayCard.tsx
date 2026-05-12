import {
	ComposedChart,
	Bar,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer
} from 'recharts';
import {Card} from '../ui/Card';
import {AXIS_TICK, CHART_TITLE, TOOLTIP_CS} from './chartStyles';

interface DayPoint {
	label: string;
	kcal: number;
	goalKcalMin?: number;
	goalKcalMax?: number;
}

interface CaloriesPerDayCardProps {
	data: DayPoint[];
}

export function CaloriesPerDayCard({data}: CaloriesPerDayCardProps) {
	const hasMin = data.some(d => d.goalKcalMin != null);
	const hasMax = data.some(d => d.goalKcalMax != null);

	return (
		<Card>
			<div style={CHART_TITLE}>Calories per day</div>
			<ResponsiveContainer width="100%" height={240}>
				<ComposedChart data={data} margin={{top: 4, right: 12, left: 0, bottom: 4}}>
					<CartesianGrid strokeDasharray="3 3" stroke="#e8f0e9" />
					<XAxis dataKey="label" tick={AXIS_TICK} />
					<YAxis tick={AXIS_TICK} width={48} />
					<Tooltip
						contentStyle={TOOLTIP_CS}
						formatter={(v, name) => {
							if (v == null) return [null, null];
							if (name === 'goalKcalMin') return [`${v} kcal`, 'Goal min'];
							if (name === 'goalKcalMax') return [`${v} kcal`, 'Goal max'];
							return [`${v} kcal`, 'Calories'];
						}}
					/>
					<Bar dataKey="kcal" name="Calories" fill="#2d6a4f" radius={[3, 3, 0, 0]} />
					{hasMin && (
						<Line
							type="stepAfter"
							dataKey="goalKcalMin"
							stroke="#f6c90e"
							strokeWidth={1.5}
							strokeDasharray="5 3"
							dot={false}
							activeDot={{r: 0}}
							legendType="none"
							connectNulls={false}
						/>
					)}
					{hasMax && (
						<Line
							type="stepAfter"
							dataKey="goalKcalMax"
							stroke="#fc8181"
							strokeWidth={1.5}
							strokeDasharray="5 3"
							dot={false}
							activeDot={{r: 0}}
							legendType="none"
							connectNulls={false}
						/>
					)}
				</ComposedChart>
			</ResponsiveContainer>
			{(hasMin || hasMax) && (
				<div style={{display: 'flex', gap: '16px', marginTop: '8px', fontSize: '11px', color: '#718096'}}>
					{hasMin && (
						<span>
							<span style={{color: '#b7791f', fontWeight: 700}}>— </span>
							kcal min goal
						</span>
					)}
					{hasMax && (
						<span>
							<span style={{color: '#c53030', fontWeight: 700}}>— </span>
							kcal max goal
						</span>
					)}
				</div>
			)}
		</Card>
	);
}
