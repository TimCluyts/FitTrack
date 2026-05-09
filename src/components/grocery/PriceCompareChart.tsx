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
import {AXIS_TICK, CHART_TITLE, TOOLTIP_CS} from '../report/chartStyles';

const STORE_COLORS = ['#2d6a4f', '#52b788', '#40916c', '#e76f51', '#74c69d', '#e9c46a', '#1b4332'];

export function PriceCompareChart() {
	const {data: products = []} = useProducts();
	const {data: stores = []} = useStores();
	const {data: prices = []} = usePrices();
	const [productId, setProductId] = useState('');

	const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));

	const storeMap = useMemo(() => Object.fromEntries(stores.map(s => [s.id, s.name])), [stores]);

	const filtered = useMemo(() => prices.filter(p => p.productId === productId), [prices, productId]);

	const latestByStore = useMemo(() => {
		const map: Record<string, {storeId: string; price: number; date: string}> = {};
		for (const entry of filtered) {
			const existing = map[entry.storeId];
			if (!existing || entry.date > existing.date) map[entry.storeId] = entry;
		}
		return Object.values(map)
			.map(e => ({store: storeMap[e.storeId] ?? '?', price: e.price}))
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
			const point: Record<string, string | number> = {date: date.slice(5).replace('-', '/')};
			for (const sid of storeIds) {
				const entry = filtered.find(e => e.storeId === sid && e.date === date);
				if (entry) point[storeMap[sid] ?? sid] = entry.price;
			}
			return point;
		});
	}, [filtered, storeMap]);

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
			<Card>
				<label
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '6px',
						fontSize: '14px',
						color: '#4a5568',
						maxWidth: '320px'
					}}>
					<span style={{fontWeight: 600, color: '#1b4332'}}>Select product to compare</span>
					<select
						value={productId}
						onChange={e => setProductId(e.target.value)}
						style={{
							padding: '8px 12px',
							fontSize: '14px',
							border: '1px solid #d1e7da',
							borderRadius: '6px',
							fontFamily: 'inherit',
							background: 'white',
							cursor: 'pointer',
							outline: 'none'
						}}>
						<option value="">Choose a product...</option>
						{sortedProducts.map(p => (
							<option key={p.id} value={p.id}>
								{p.name}
							</option>
						))}
					</select>
				</label>
			</Card>

			{productId && filtered.length === 0 && (
				<Card>
					<div style={{color: '#a0aec0', fontSize: '14px', textAlign: 'center', padding: '20px 0'}}>
						No price entries for this product yet. Log some prices on the Prices tab.
					</div>
				</Card>
			)}

			{latestByStore.length > 0 && (
				<Card>
					<div style={CHART_TITLE}>Latest price by store (€)</div>
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
								formatter={v => [`€${Number(v).toFixed(2)}`, 'Price']}
							/>
							<Bar dataKey="price" fill="#2d6a4f" radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</Card>
			)}

			{historyData.length > 1 && (
				<Card>
					<div style={CHART_TITLE}>Price over time by store (€)</div>
					<ResponsiveContainer width="100%" height={250}>
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
								formatter={(v, name) => [`€${Number(v).toFixed(2)}`, name]}
							/>
							<Legend wrapperStyle={{fontSize: '12px'}} />
							{historyStoreNames.map((name, i) => (
								<Line
									key={name}
									type="monotone"
									dataKey={name}
									stroke={STORE_COLORS[i % STORE_COLORS.length]}
									strokeWidth={2}
									dot={{r: 3, fill: STORE_COLORS[i % STORE_COLORS.length]}}
									activeDot={{r: 5}}
									connectNulls={false}
								/>
							))}
						</LineChart>
					</ResponsiveContainer>
				</Card>
			)}
		</div>
	);
}
