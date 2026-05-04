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
import type {RunLog} from '../../types/fitness';

interface ChartPoint {
	label: string;
	distanceKm: number;
}

interface RunDistanceCardProps {
	data: ChartPoint[];
	firstRun?: RunLog;
}

export function RunDistanceCard({data, firstRun}: RunDistanceCardProps) {
	return (
		<Card>
			<div style={CHART_TITLE}>Distance per run (km)</div>
			{data.length > 1 ? (
				<ResponsiveContainer width="100%" height={220}>
					<LineChart
						data={data}
						margin={{top: 4, right: 12, left: 0, bottom: 4}}>
						<CartesianGrid strokeDasharray="3 3" stroke="#e8f0e9" />
						<XAxis dataKey="label" tick={AXIS_TICK} />
						<YAxis tick={AXIS_TICK} width={48} domain={[0, 'auto']} />
						<Tooltip
							contentStyle={TOOLTIP_CS}
							formatter={v => [`${v} km`, 'Distance']}
						/>
						<Line
							type="monotone"
							dataKey="distanceKm"
							stroke="#4299e1"
							strokeWidth={2}
							dot={{r: 3, fill: '#4299e1'}}
							activeDot={{r: 5}}
						/>
					</LineChart>
				</ResponsiveContainer>
			) : (
				<div style={{color: '#a0aec0', fontSize: '13px'}}>
					{firstRun?.distanceKm} km on {firstRun?.date}
				</div>
			)}
		</Card>
	);
}
