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

interface ChartPoint {
	label: string;
	speedKmh: number | null;
}

interface RunSpeedCardProps {
	data: ChartPoint[];
}

export function RunSpeedCard({data}: RunSpeedCardProps) {
	return (
		<Card>
			<div style={CHART_TITLE}>Average speed (km/h)</div>
			<ResponsiveContainer width="100%" height={200}>
				<LineChart
					data={data}
					margin={{top: 4, right: 12, left: 0, bottom: 4}}>
					<CartesianGrid strokeDasharray="3 3" stroke="#e8f0e9" />
					<XAxis dataKey="label" tick={AXIS_TICK} />
					<YAxis tick={AXIS_TICK} width={48} domain={['auto', 'auto']} />
					<Tooltip
						contentStyle={TOOLTIP_CS}
						formatter={v => [`${v} km/h`, 'Speed']}
					/>
					<Line
						type="monotone"
						dataKey="speedKmh"
						stroke="#ed8936"
						strokeWidth={2}
						dot={{r: 3, fill: '#ed8936'}}
						activeDot={{r: 5}}
						connectNulls
					/>
				</LineChart>
			</ResponsiveContainer>
		</Card>
	);
}
