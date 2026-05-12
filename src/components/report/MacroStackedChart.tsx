import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from 'recharts';
import {AXIS_TICK, TOOLTIP_CS} from './chartStyles';
import type {MacroDayPoint} from './macroConfig';

export function MacroStackedChart({data}: {data: MacroDayPoint[]}) {
	return (
		<ResponsiveContainer width="100%" height={220}>
			<BarChart data={data} margin={{top: 4, right: 12, left: 0, bottom: 4}}>
				<CartesianGrid strokeDasharray="3 3" stroke="#e8f0e9" />
				<XAxis dataKey="label" tick={AXIS_TICK} />
				<YAxis tick={AXIS_TICK} width={48} />
				<Tooltip
					contentStyle={TOOLTIP_CS}
					formatter={(v, name) => [`${v ?? 0}g`, String(name)]}
				/>
				<Legend wrapperStyle={{fontSize: '12px'}} />
				<Bar dataKey="protein" name="Protein" fill="#48bb78" stackId="m" />
				<Bar dataKey="carbs" name="Carbs" fill="#4299e1" stackId="m" />
				<Bar dataKey="fat" name="Fat" fill="#ed8936" stackId="m" radius={[3, 3, 0, 0]} />
			</BarChart>
		</ResponsiveContainer>
	);
}
