import {useMemo} from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	ReferenceLine
} from 'recharts';
import {useStores, usePrices} from '../../hooks/useApi';
import {Card} from '../ui/Card';
import {AXIS_TICK, CHART_TITLE, TOOLTIP_CS} from '../report/chartStyles';
import type {PriceEntry} from '../../types/fitness';

function latestRegularPrice(entries: PriceEntry[]): number | null {
	const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
	const nonPromo = sorted.find(e => !e.isPromo);
	if (nonPromo) return nonPromo.price;
	const withRegular = sorted.find(e => e.isPromo && e.regularPrice != null);
	return withRegular?.regularPrice ?? null;
}

export function StoreOverview() {
	const {data: prices = []} = usePrices();
	const {data: stores = []} = useStores();

	const storeMap = useMemo(() => Object.fromEntries(stores.map(s => [s.id, s.name])), [stores]);

	const indexData = useMemo(() => {
		// Group all entries by product, then by store within each product
		const byProduct: Record<string, Record<string, PriceEntry[]>> = {};
		for (const entry of prices) {
			const prod = (byProduct[entry.productId] ??= {});
			(prod[entry.storeId] ??= []).push(entry);
		}

		// For each product, get the latest regular price per store
		// Only include products with prices at 2+ stores (meaningful comparison)
		const storeRatios: Record<string, {sum: number; count: number}> = {};

		for (const byStore of Object.values(byProduct)) {
			const storePrices: Record<string, number> = {};
			for (const [storeId, entries] of Object.entries(byStore)) {
				const p = latestRegularPrice(entries);
				if (p != null) storePrices[storeId] = p;
			}
			if (Object.keys(storePrices).length < 2) continue;

			const minPrice = Math.min(...Object.values(storePrices));
			for (const [storeId, price] of Object.entries(storePrices)) {
				const bucket = (storeRatios[storeId] ??= {sum: 0, count: 0});
				bucket.sum += price / minPrice;
				bucket.count += 1;
			}
		}

		return Object.entries(storeRatios)
			.map(([storeId, {sum, count}]) => ({
				store: storeMap[storeId] ?? '?',
				premium: Math.round(((sum / count) - 1) * 1000) / 10,
				count
			}))
			.sort((a, b) => a.premium - b.premium);
	}, [prices, storeMap]);

	if (indexData.length < 2) return null;

	const maxCount = Math.max(...indexData.map(d => d.count));

	return (
		<Card>
			<div style={CHART_TITLE}>Overall store price index</div>
			<div style={{fontSize: '12px', color: '#718096', marginBottom: '16px'}}>
				Average % above the cheapest store, across {maxCount} product{maxCount !== 1 ? 's' : ''} compared. 0% = always the cheapest option.
			</div>
			<ResponsiveContainer width="100%" height={Math.max(160, indexData.length * 44)}>
				<BarChart
					data={indexData}
					layout="vertical"
					margin={{top: 4, right: 48, left: 4, bottom: 4}}>
					<CartesianGrid strokeDasharray="3 3" stroke="#e8f0e9" horizontal={false} />
					<XAxis
						type="number"
						tick={AXIS_TICK}
						tickFormatter={v => `${v}%`}
						domain={[0, 'auto']}
					/>
					<YAxis type="category" dataKey="store" tick={AXIS_TICK} width={72} />
					<ReferenceLine x={0} stroke="#2d6a4f" strokeWidth={2} />
					<Tooltip
						contentStyle={TOOLTIP_CS}
						formatter={(v: unknown, _: unknown, props: any) => [
							`+${v}% vs cheapest (${props.payload?.count ?? 0} products)`,
							'Price premium'
						]}
					/>
					<Bar dataKey="premium" fill="#52b788" radius={[0, 4, 4, 0]}
						label={{position: 'right', formatter: (v: number) => `+${v}%`, fontSize: 11, fill: '#4a5568'}}
					/>
				</BarChart>
			</ResponsiveContainer>
		</Card>
	);
}
