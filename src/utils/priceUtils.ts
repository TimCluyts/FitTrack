import type {PriceEntry} from '../types/fitness';

export const STORE_COLORS = ['#2d6a4f', '#52b788', '#40916c', '#e76f51', '#74c69d', '#e9c46a', '#1b4332'];

export function latestRegularPrice(entries: PriceEntry[]): number | null {
	const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
	const nonPromo = sorted.find(e => !e.isPromo);
	if (nonPromo) return nonPromo.price;
	const withRegular = sorted.find(e => e.isPromo && e.regularPrice != null);
	return withRegular?.regularPrice ?? null;
}

export function computeStoreRatios(
	entries: PriceEntry[]
): Record<string, {sum: number; count: number}> {
	const byProduct: Record<string, Record<string, PriceEntry[]>> = {};
	for (const entry of entries) {
		const prod = (byProduct[entry.productId] ??= {});
		(prod[entry.storeId] ??= []).push(entry);
	}
	const ratios: Record<string, {sum: number; count: number}> = {};
	for (const byStore of Object.values(byProduct)) {
		const storePrices: Record<string, number> = {};
		for (const [storeId, storeEntries] of Object.entries(byStore)) {
			const p = latestRegularPrice(storeEntries);
			if (p != null) storePrices[storeId] = p;
		}
		if (Object.keys(storePrices).length < 2) continue;
		const minPrice = Math.min(...Object.values(storePrices));
		for (const [storeId, price] of Object.entries(storePrices)) {
			const bucket = (ratios[storeId] ??= {sum: 0, count: 0});
			bucket.sum += price / minPrice;
			bucket.count += 1;
		}
	}
	return ratios;
}

export function ratioPremium(sum: number, count: number): number {
	return Math.round(((sum / count) - 1) * 1000) / 10;
}
