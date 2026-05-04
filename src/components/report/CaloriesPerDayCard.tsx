import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import {Card} from '../ui/Card';
import {AXIS_TICK, CHART_TITLE, TOOLTIP_CS} from './chartStyles';

interface DayPoint {
	label: string;
	kcal: number;
}

interface CaloriesPerDayCardProps {
	data: DayPoint[];
}

export function CaloriesPerDayCard({data}: CaloriesPerDayCardProps) {
	return (
		<Card>
			<div style={CHART_TITLE}>Calories per day</div>
			<ResponsiveContainer width="100%" height={240}>
				<BarChart
					data={data}
					margin={{top: 4, right: 12, left: 0, bottom: 4}}>
					<CartesianGrid strokeDasharray="3 3" stroke="#e8f0e9" />
					<XAxis dataKey="label" tick={AXIS_TICK} />
					<YAxis tick={AXIS_TICK} width={48} />
					<Tooltip
						contentStyle={TOOLTIP_CS}
						formatter={v => [`${v ?? 0} kcal`, 'Calories']}
					/>
					<Bar dataKey="kcal" name="Kcal" fill="#2d6a4f" radius={[3, 3, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</Card>
	);
}
