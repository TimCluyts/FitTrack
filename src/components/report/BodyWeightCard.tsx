import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from 'recharts';
import {Card} from '../ui/Card';
import {AXIS_TICK, CHART_TITLE, TOOLTIP_CS} from './chartStyles';
import type {WeightEntry} from '../../types/fitness';

function linearTrend(values: number[]): number[] {
	const n = values.length;
	if (n < 2) return [...values];
	let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
	for (let i = 0; i < n; i++) {
		sumX += i;
		sumY += values[i];
		sumXY += i * values[i];
		sumX2 += i * i;
	}
	const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
	const b = (sumY - m * sumX) / n;
	return values.map((_, i) => Number.parseFloat((m * i + b).toFixed(2)));
}

interface BodyWeightCardProps {
	entries: WeightEntry[];
}

export function BodyWeightCard({entries}: BodyWeightCardProps) {
	const sorted = [...entries]
		.sort((a, b) => a.date.localeCompare(b.date))
		.slice(-60);

	const trend = linearTrend(sorted.map(e => e.weight));

	const data = sorted.map((e, i) => ({
		label: e.date.slice(5).replace('-', '/'),
		weight: e.weight,
		trend: trend[i]
	}));

	return (
		<Card>
			<div style={CHART_TITLE}>Body weight (kg)</div>
			{data.length > 1 ? (
				<ResponsiveContainer width="100%" height={220}>
					<LineChart data={data} margin={{top: 4, right: 12, left: 0, bottom: 4}}>
						<CartesianGrid strokeDasharray="3 3" stroke="#e8f0e9" />
						<XAxis dataKey="label" tick={AXIS_TICK} />
						<YAxis tick={AXIS_TICK} width={48} domain={['auto', 'auto']} />
						<Tooltip
							contentStyle={TOOLTIP_CS}
							formatter={(v, name) => [`${v} kg`, name === 'trend' ? 'Trend' : 'Weight']}
						/>
						<Legend wrapperStyle={{fontSize: '12px'}} />
						<Line
							type="monotone"
							dataKey="weight"
							name="Weight"
							stroke="#2d6a4f"
							strokeWidth={2}
							dot={{r: 3, fill: '#2d6a4f'}}
							activeDot={{r: 5}}
						/>
						<Line
							type="linear"
							dataKey="trend"
							name="Trend"
							stroke="#f4a261"
							strokeWidth={1.5}
							strokeDasharray="6 3"
							dot={false}
							activeDot={{r: 0}}
						/>
					</LineChart>
				</ResponsiveContainer>
			) : (
				<div style={{color: '#a0aec0', fontSize: '13px'}}>
					{entries[0]?.weight} kg on {entries[0]?.date}
				</div>
			)}
		</Card>
	);
}
