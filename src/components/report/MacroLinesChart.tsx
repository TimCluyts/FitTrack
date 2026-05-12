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
import {AXIS_TICK, TOOLTIP_CS} from './chartStyles';
import {MACROS, type MacroDayPoint, type MacroKey} from './macroConfig';

interface MacroLinesChartProps {
	data: MacroDayPoint[];
	active: Record<MacroKey, boolean>;
}

export function MacroLinesChart({data, active}: MacroLinesChartProps) {
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

	const hasAnyGoal = activeMacros.some(m => data.some(d => d[m.chartGoalKey] != null));

	return (
		<ResponsiveContainer width="100%" height={220}>
			<LineChart data={data} margin={{top: 4, right: 12, left: 0, bottom: 4}}>
				<CartesianGrid strokeDasharray="3 3" stroke="#e8f0e9" />
				<XAxis dataKey="label" tick={AXIS_TICK} />
				<YAxis tick={AXIS_TICK} width={48} />
				<Tooltip
					contentStyle={TOOLTIP_CS}
					formatter={(v, name) => {
						if (v == null) return [null, null];
						const goalMacro = MACROS.find(m => m.chartGoalKey === name);
						if (goalMacro) return [`${goalMacro.goalPrefix}${v}g`, `${goalMacro.label} goal`];
						return [`${v ?? 0}g`, String(name)];
					}}
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
				{hasAnyGoal &&
					activeMacros.map(m => (
						<Line
							key={`goal-${m.key}`}
							type="stepAfter"
							dataKey={m.chartGoalKey}
							stroke={m.color}
							strokeWidth={1.5}
							strokeDasharray="5 3"
							strokeOpacity={0.65}
							dot={false}
							activeDot={{r: 0}}
							legendType="none"
							connectNulls={false}
						/>
					))}
			</LineChart>
		</ResponsiveContainer>
	);
}
