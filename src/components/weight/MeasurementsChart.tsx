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
import {useMeasurementEntries} from '../../hooks/useApi';
import {Card} from '../ui/Card';
import {AXIS_TICK, CHART_TITLE, TOOLTIP_CS} from '../report/chartStyles';

export function MeasurementsChart() {
	const {data: entries = []} = useMeasurementEntries();

	const sorted = [...entries]
		.filter(e => e.waistCm != null || e.chestCm != null)
		.sort((a, b) => a.date.localeCompare(b.date))
		.slice(-60);

	if (sorted.length < 2) return null;

	const data = sorted.map(e => ({
		label: e.date.slice(5).replace('-', '/'),
		waist: e.waistCm ?? null,
		chest: e.chestCm ?? null
	}));

	return (
		<Card>
			<div style={CHART_TITLE}>Measurements (cm)</div>
			<ResponsiveContainer width="100%" height={220}>
				<LineChart data={data} margin={{top: 4, right: 12, left: 0, bottom: 4}}>
					<CartesianGrid strokeDasharray="3 3" stroke="#e8f0e9" />
					<XAxis dataKey="label" tick={AXIS_TICK} />
					<YAxis tick={AXIS_TICK} width={48} domain={['auto', 'auto']} />
					<Tooltip
						contentStyle={TOOLTIP_CS}
						formatter={(v, name) => [`${v} cm`, name === 'waist' ? 'Waist' : 'Chest']}
					/>
					<Legend wrapperStyle={{fontSize: '12px'}} />
					<Line
						type="monotone"
						dataKey="waist"
						name="Waist"
						stroke="#2d6a4f"
						strokeWidth={2}
						dot={{r: 3, fill: '#2d6a4f'}}
						activeDot={{r: 5}}
						connectNulls
					/>
					<Line
						type="monotone"
						dataKey="chest"
						name="Chest"
						stroke="#f4a261"
						strokeWidth={2}
						dot={{r: 3, fill: '#f4a261'}}
						activeDot={{r: 5}}
						connectNulls
					/>
				</LineChart>
			</ResponsiveContainer>
		</Card>
	);
}
