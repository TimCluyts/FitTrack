import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	ReferenceLine
} from 'recharts';
import {AXIS_TICK, TOOLTIP_CS} from './chartStyles';
import {MACROS, type MacroDayPoint, type MacroKey} from './macroConfig';
import type {DailyGoals} from '../../types/fitness';

interface MacroLinesChartProps {
	data: MacroDayPoint[];
	goals?: DailyGoals;
	active: Record<MacroKey, boolean>;
}

export function MacroLinesChart({data, goals, active}: MacroLinesChartProps) {
	const activeMacros = MACROS.filter(m => active[m.key]);

	if (activeMacros.length === 0) {
		return (
			<div
				style={{
					height: 220,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: '#a0aec0',
					fontSize: '13px'
				}}>
				Select at least one macro above
			</div>
		);
	}

	return (
		<ResponsiveContainer width="100%" height={220}>
			<LineChart data={data} margin={{top: 4, right: 12, left: 0, bottom: 4}}>
				<CartesianGrid strokeDasharray="3 3" stroke="#e8f0e9" />
				<XAxis dataKey="label" tick={AXIS_TICK} />
				<YAxis tick={AXIS_TICK} width={48} />
				<Tooltip
					contentStyle={TOOLTIP_CS}
					formatter={(v, name) => [`${v ?? 0}g`, String(name)]}
				/>
				<Legend wrapperStyle={{fontSize: '12px'}} />
				{activeMacros.map(m => (
					<Line
						key={m.key}
						type="monotone"
						dataKey={m.key}
						name={m.label}
						stroke={m.color}
						strokeWidth={2}
						dot={{r: 2, fill: m.color}}
						activeDot={{r: 4}}
					/>
				))}
				{activeMacros.map(m => {
					const goal = goals?.[m.goalKey];
					if (goal == null) return null;
					return (
						<ReferenceLine
							key={`goal-${m.key}`}
							y={goal}
							stroke={m.color}
							strokeWidth={1.5}
							strokeDasharray="6 3"
							strokeOpacity={0.75}
							label={{
								value: `${m.goalPrefix} ${goal}g`,
								position: 'insideTopRight',
								fill: m.color,
								fontSize: 11,
								fontWeight: 600
							}}
						/>
					);
				})}
			</LineChart>
		</ResponsiveContainer>
	);
}
