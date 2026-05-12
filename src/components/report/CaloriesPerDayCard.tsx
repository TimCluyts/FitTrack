import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	ReferenceLine
} from 'recharts';
import {Card} from '../ui/Card';
import {AXIS_TICK, CHART_TITLE, TOOLTIP_CS} from './chartStyles';
import type {DailyGoals} from '../../types/fitness';

interface DayPoint {
	label: string;
	kcal: number;
}

interface CaloriesPerDayCardProps {
	data: DayPoint[];
	goals?: DailyGoals;
}

export function CaloriesPerDayCard({data, goals}: CaloriesPerDayCardProps) {
	const hasMin = goals?.kcalMin != null;
	const hasMax = goals?.kcalMax != null;

	return (
		<Card>
			<div style={CHART_TITLE}>Calories per day</div>
			<ResponsiveContainer width="100%" height={240}>
				<BarChart data={data} margin={{top: 4, right: 12, left: 0, bottom: 4}}>
					<CartesianGrid strokeDasharray="3 3" stroke="#e8f0e9" />
					<XAxis dataKey="label" tick={AXIS_TICK} />
					<YAxis tick={AXIS_TICK} width={48} />
					<Tooltip
						contentStyle={TOOLTIP_CS}
						formatter={v => [`${v ?? 0} kcal`, 'Calories']}
					/>
					<Bar dataKey="kcal" name="Kcal" fill="#2d6a4f" radius={[3, 3, 0, 0]} />
					{hasMin && (
						<ReferenceLine
							y={goals!.kcalMin}
							stroke="#f6c90e"
							strokeWidth={1.5}
							strokeDasharray="6 3"
							label={{
								value: `min ${goals!.kcalMin}`,
								position: 'insideTopRight',
								fill: '#b7791f',
								fontSize: 11
							}}
						/>
					)}
					{hasMax && (
						<ReferenceLine
							y={goals!.kcalMax}
							stroke="#fc8181"
							strokeWidth={1.5}
							strokeDasharray="6 3"
							label={{
								value: `max ${goals!.kcalMax}`,
								position: 'insideTopRight',
								fill: '#c53030',
								fontSize: 11
							}}
						/>
					)}
				</BarChart>
			</ResponsiveContainer>
			{(hasMin || hasMax) && (
				<div
					style={{
						display: 'flex',
						gap: '16px',
						marginTop: '8px',
						fontSize: '11px',
						color: '#718096'
					}}>
					{hasMin && (
						<span>
							<span style={{color: '#b7791f', fontWeight: 700}}>— </span>
							min {goals!.kcalMin} kcal
						</span>
					)}
					{hasMax && (
						<span>
							<span style={{color: '#c53030', fontWeight: 700}}>— </span>
							max {goals!.kcalMax} kcal
						</span>
					)}
				</div>
			)}
		</Card>
	);
}
