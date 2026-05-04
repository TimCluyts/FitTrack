import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer
} from 'recharts';
import {useWeightEntries} from '../../hooks/useApi';
import {Card} from '../ui/Card';

const AXIS_TICK = {fontSize: 11, fill: '#718096'} as const;
const TOOLTIP_CS = {
	fontSize: '13px',
	borderRadius: '6px',
	border: '1px solid #e2e8f0'
} as const;

export function WeightChart() {
	const {data: entries = []} = useWeightEntries();

	const chartData = [...entries]
		.sort((a, b) => a.date.localeCompare(b.date))
		.slice(-60)
		.map(e => ({weight: e.weight, label: e.date.slice(5).replace('-', '/')}));

	if (chartData.length <= 1) return null;

	return (
		<Card>
			<div
				style={{
					fontWeight: 600,
					fontSize: '15px',
					color: '#1b4332',
					marginBottom: '16px'
				}}>
				Weight over time
			</div>
			<ResponsiveContainer width="100%" height={220}>
				<LineChart
					data={chartData}
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
		</Card>
	);
}
