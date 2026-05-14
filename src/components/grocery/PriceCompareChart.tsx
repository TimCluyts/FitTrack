import {useState, useMemo} from 'react';
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend
} from 'recharts';
import {useProducts, useStores, usePrices} from '../../hooks/useApi';
import {Card} from '../ui/Card';
import type {PriceEntry} from '../../types/fitness';
import {ModeToggle} from '../ui/ModeToggle';
import {ProductCombobox} from '../ProductCombobox';
import {AXIS_TICK, CHART_TITLE, TOOLTIP_CS} from '../report/chartStyles';
import {STORE_COLORS, latestRegularPrice} from '../../utils/priceUtils';

const CHART_MODES = [
	{value: 'bar' as const, label: 'Current prices'},
	{value: 'line' as const, label: 'Evolution'}
] as const;

export function PriceCompareChart() {
	const {data: products = []} = useProducts();
	const {data: stores = []} = useStores();
	const {data: prices = []} = usePrices();
	const [productId, setProductId] = useState('');
	const [chartMode, setChartMode] = useState<'bar' | 'line'>('bar');

	const storeMap = useMemo(() => Object.fromEntries(stores.map(s => [s.id, s.name])), [stores]);
	const filtered = useMemo(() => prices.filter(p => p.productId === productId), [prices, productId]);

	const latestByStore = useMemo(() => {
		const byStore: Record<string, PriceEntry[]> = {};
		for (const e of filtered) {
			(byStore[e.storeId] ??= []).push(e);
		}
		return Object.entries(byStore)
			.map(([sid, entries]) => {
				const p = latestRegularPrice(entries);
				return p != null ? {store: storeMap[sid] ?? '?', price: p} : null;
			})
			.filter((x): x is {store: string; price: number} => x !== null)
			.sort((a, b) => a.price - b.price);
	}, [filtered, storeMap]);

	const historyStoreNames = useMemo(
		() => [...new Set(filtered.map(e => storeMap[e.storeId] ?? e.storeId))],
		[filtered, storeMap]
	);

	const historyData = useMemo(() => {
		const allDates = [...new Set(filtered.map(e => e.date))].sort();
		const storeIds = [...new Set(filtered.map(e => e.storeId))];
		return allDates.map(date => {
			const point: Record<string, string | number | boolean> = {
				date: date.slice(5).replace('-', '/')
			};
			for (const sid of storeIds) {
				const entry = filtered.find(e => e.storeId === sid && e.date === date);
				if (entry) {
					const name = storeMap[sid] ?? sid;
					point[name] = entry.price;
					point[`${name}__promo`] = entry.isPromo ?? false;
				}
			}
			return point;
		});
	}, [filtered, storeMap]);

	const hasBarData = latestByStore.length > 0;
	const hasLineData = historyData.length > 0;

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
			<Card>
				<div style={{marginBottom: '14px'}}>
					<div style={{fontWeight: 600, color: '#1b4332', fontSize: '14px', marginBottom: '8px'}}>
						Select product to compare
					</div>
					<ProductCombobox
						products={products}
						value={productId}
						onChange={setProductId}
						placeholder="Search product…"
					/>
				</div>
				{productId && (
					<ModeToggle options={CHART_MODES} value={chartMode} onChange={setChartMode} />
				)}
			</Card>

			{productId && filtered.length === 0 && (
				<Card>
					<div style={{color: '#a0aec0', fontSize: '14px', textAlign: 'center', padding: '20px 0'}}>
						No price entries for this product yet. Log some prices on the Prices tab.
					</div>
				</Card>
			)}

			{chartMode === 'bar' && hasBarData && (
				<Card>
					<div style={CHART_TITLE}>Current regular price by store (€)</div>
					<div style={{fontSize: '12px', color: '#718096', marginBottom: '12px'}}>
						Promotional prices are excluded — uses the latest regular price per store.
					</div>
					<ResponsiveContainer width="100%" height={220}>
						<BarChart data={latestByStore} margin={{top: 4, right: 12, left: 0, bottom: 4}}>
							<CartesianGrid strokeDasharray="3 3" stroke="#e8f0e9" />
							<XAxis dataKey="store" tick={AXIS_TICK} />
							<YAxis
								tick={AXIS_TICK}
								width={52}
								domain={[0, 'auto']}
								tickFormatter={v => `€${v}`}
							/>
							<Tooltip
								contentStyle={TOOLTIP_CS}
								formatter={v => [`€${Number(v).toFixed(2)}`, 'Regular price']}
							/>
							<Bar dataKey="price" fill="#2d6a4f" radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</Card>
			)}

			{chartMode === 'line' && hasLineData && (
				<Card>
					<div style={CHART_TITLE}>Price evolution by store (€)</div>
					<div style={{fontSize: '12px', color: '#718096', marginBottom: '12px'}}>
						● regular price &nbsp;■ promotional price
					</div>
					<ResponsiveContainer width="100%" height={280}>
						<LineChart data={historyData} margin={{top: 4, right: 12, left: 0, bottom: 4}}>
							<CartesianGrid strokeDasharray="3 3" stroke="#e8f0e9" />
							<XAxis dataKey="date" tick={AXIS_TICK} />
							<YAxis
								tick={AXIS_TICK}
								width={52}
								domain={['auto', 'auto']}
								tickFormatter={v => `€${v}`}
							/>
							<Tooltip
								contentStyle={TOOLTIP_CS}
								formatter={(v, name) => {
									const label = String(name).endsWith('__promo') ? null : `€${Number(v).toFixed(2)}`;
									return label ? [label, name] : [null, null];
								}}
							/>
							<Legend wrapperStyle={{fontSize: '12px'}} />
							{historyStoreNames.map((name, i) => {
								const color = STORE_COLORS[i % STORE_COLORS.length];
								return (
									<Line
										key={name}
										type="monotone"
										dataKey={name}
										stroke={color}
										strokeWidth={2}
										dot={(props: any) => {
											const {cx, cy, payload} = props;
											if (cx == null || cy == null) return <></>;
											return payload[`${name}__promo`] ? (
												<rect
													key={`${cx}-${cy}`}
													x={cx - 5}
													y={cy - 5}
													width={10}
													height={10}
													fill={color}
													stroke="white"
													strokeWidth={1.5}
												/>
											) : (
												<circle
													key={`${cx}-${cy}`}
													cx={cx}
													cy={cy}
													r={3.5}
													fill={color}
												/>
											);
										}}
										activeDot={{r: 5}}
										connectNulls={false}
									/>
								);
							})}
						</LineChart>
					</ResponsiveContainer>
				</Card>
			)}

			{chartMode === 'line' && productId && !hasLineData && filtered.length > 0 && (
				<Card>
					<div style={{color: '#a0aec0', fontSize: '14px', textAlign: 'center', padding: '20px 0'}}>
						Not enough data points for an evolution chart yet.
					</div>
				</Card>
			)}
		</div>
	);
}
