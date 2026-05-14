import {useState} from 'react';
import {
	BarChart, Bar,
	LineChart, Line,
	XAxis, YAxis,
	CartesianGrid, Tooltip,
	ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import {Card} from '../ui/Card';
import {ModeToggle} from '../ui/ModeToggle';
import {AXIS_TICK, CHART_TITLE, TOOLTIP_CS} from '../report/chartStyles';
import {STORE_COLORS} from '../../utils/priceUtils';
import {useStoreIndex, type StoreIndexPoint} from '../../hooks/useStoreIndex';

const CHART_MODES = [
	{value: 'bar' as const, label: 'Store index'},
	{value: 'line' as const, label: 'Over time'}
] as const;

function IndexBarChart({data}: {data: StoreIndexPoint[]}) {
	return (
		<ResponsiveContainer width="100%" height={Math.max(160, data.length * 44)}>
			<BarChart data={data} layout="vertical" margin={{top: 4, right: 48, left: 4, bottom: 4}}>
				<CartesianGrid strokeDasharray="3 3" stroke="#e8f0e9" horizontal={false} />
				<XAxis type="number" tick={AXIS_TICK} tickFormatter={v => `${v}%`} domain={[0, 'auto']} />
				<YAxis type="category" dataKey="store" tick={AXIS_TICK} width={72} />
				<ReferenceLine x={0} stroke="#2d6a4f" strokeWidth={2} />
				<Tooltip
					contentStyle={TOOLTIP_CS}
					formatter={(v: unknown, _: unknown, props: any) => [
						`+${v}% vs cheapest (${props.payload?.count ?? 0} products)`,
						'Price premium'
					]}
				/>
				<Bar
					dataKey="premium"
					fill="#52b788"
					radius={[0, 4, 4, 0]}
					label={{position: 'right', formatter: (v: unknown) => typeof v === 'number' ? `+${v}%` : '', fontSize: 11, fill: '#4a5568'}}
				/>
			</BarChart>
		</ResponsiveContainer>
	);
}

function IndexLineChart({data, storeNames}: {data: Record<string, string | number>[]; storeNames: string[]}) {
	return (
		<ResponsiveContainer width="100%" height={260}>
			<LineChart data={data} margin={{top: 4, right: 12, left: 0, bottom: 4}}>
				<CartesianGrid strokeDasharray="3 3" stroke="#e8f0e9" />
				<XAxis dataKey="date" tick={AXIS_TICK} />
				<YAxis tick={AXIS_TICK} width={48} tickFormatter={v => `+${v}%`} domain={[0, 'auto']} />
				<Tooltip contentStyle={TOOLTIP_CS} formatter={(v: unknown, name: unknown) => [`+${Number(v).toFixed(1)}%`, typeof name === 'string' ? name : '']} />
				<Legend wrapperStyle={{fontSize: '12px'}} />
				{storeNames.map((name, i) => (
					<Line
						key={name}
						type="monotone"
						dataKey={name}
						stroke={STORE_COLORS[i % STORE_COLORS.length]}
						strokeWidth={2}
						dot={{r: 3}}
						activeDot={{r: 5}}
						connectNulls
					/>
				))}
			</LineChart>
		</ResponsiveContainer>
	);
}

export function StoreOverview() {
	const {indexData, timelineData, storeNames, maxCount} = useStoreIndex();
	const [chartMode, setChartMode] = useState<'bar' | 'line'>('bar');

	if (indexData.length < 2) return null;

	const subtitle = chartMode === 'bar'
		? `Average % above the cheapest store, across ${maxCount} product${maxCount !== 1 ? 's' : ''} compared.`
		: 'Rolling average % above cheapest store, as prices were logged over time.';

	return (
		<Card>
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px'}}>
				<div>
					<div style={CHART_TITLE}>Overall store price index</div>
					<div style={{fontSize: '12px', color: '#718096', marginTop: '2px'}}>{subtitle}</div>
				</div>
				<ModeToggle options={CHART_MODES} value={chartMode} onChange={setChartMode} />
			</div>

			{chartMode === 'bar' && <IndexBarChart data={indexData} />}
			{chartMode === 'line' && timelineData.length > 0 && <IndexLineChart data={timelineData} storeNames={storeNames} />}
		</Card>
	);
}
