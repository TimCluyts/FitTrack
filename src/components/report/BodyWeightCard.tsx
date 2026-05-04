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
import {AXIS_TICK, CHART_TITLE, TOOLTIP_CS} from './chartStyles';
import type {WeightEntry} from '../../types/fitness';

interface BodyWeightCardProps {
	entries: WeightEntry[];
}

export function BodyWeightCard({entries}: BodyWeightCardProps) {
	const data = [...entries]
		.sort((a, b) => a.date.localeCompare(b.date))
		.slice(-60)
		.map(e => ({weight: e.weight, label: e.date.slice(5).replace('-', '/')}));

	return (
		<Card>
			<div style={CHART_TITLE}>Body weight (kg)</div>
			{data.length > 1 ? (
				<ResponsiveContainer width="100%" height={220}>
					<LineChart
						data={data}
						margin={{top: 4, right: 12, left: 0, bottom: 4}}>
						<CartesianGrid strokeDasharray="3 3" stroke="#e8f0e9" />
						<XAxis dataKey="label" tick={AXIS_TICK} />
						<YAxis tick={AXIS_TICK} width={48} domain={['auto', 'auto']} />
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
					{entries[0]?.weight} kg on {entries[0]?.date}
				</div>
			)}
		</Card>
	);
}
