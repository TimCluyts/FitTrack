import {useMemo} from 'react';
import {usePrices, useStores} from './useApi';
import {computeStoreRatios, ratioPremium} from '../utils/priceUtils';

export interface StoreIndexPoint {
	store: string;
	premium: number;
	count: number;
}

export function useStoreIndex() {
	const {data: prices = []} = usePrices();
	const {data: stores = []} = useStores();

	const storeMap = useMemo(
		() => Object.fromEntries(stores.map(s => [s.id, s.name])),
		[stores]
	);

	const indexData = useMemo((): StoreIndexPoint[] => {
		const ratios = computeStoreRatios(prices);
		return Object.entries(ratios)
			.map(([storeId, {sum, count}]) => ({
				store: storeMap[storeId] ?? '?',
				premium: ratioPremium(sum, count),
				count
			}))
			.sort((a, b) => a.premium - b.premium);
	}, [prices, storeMap]);

	const timelineData = useMemo(() => {
		const allDates = [...new Set(prices.map(p => p.date))].sort();
		return allDates.map(currentDate => {
			const ratios = computeStoreRatios(prices.filter(e => e.date <= currentDate));
			const point: Record<string, string | number> = {
				date: currentDate.slice(5).replace('-', '/')
			};
			for (const [storeId, {sum, count}] of Object.entries(ratios)) {
				point[storeMap[storeId] ?? storeId] = ratioPremium(sum, count);
			}
			return point;
		});
	}, [prices, storeMap]);

	const storeNames = useMemo(() => stores.map(s => s.name), [stores]);
	const maxCount = indexData.length > 0 ? Math.max(...indexData.map(d => d.count)) : 0;

	return {indexData, timelineData, storeNames, maxCount};
}
