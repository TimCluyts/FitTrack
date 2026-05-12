import {useMemo, useState} from 'react';
import {useAddLogEntry, useFavorites, useProducts} from './useApi';
import {toGrams} from '../utils/serving';
import type {MealTime, Product} from '../types/fitness';

export function useFavoriteQuickAdd(date: string) {
	const {data: products = []} = useProducts();
	const {data: favoriteIds = []} = useFavorites();
	const addLogEntry = useAddLogEntry();

	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [amount, setAmount] = useState('');
	const [mealTime, setMealTime] = useState<MealTime>('morning');

	const favoriteProducts = useMemo(
		() =>
			favoriteIds
				.map(id => products.find(p => p.id === id))
				.filter((p): p is Product => p !== undefined),
		[favoriteIds, products]
	);

	const selectedProduct = favoriteProducts.find(p => p.id === selectedId) ?? null;

	const selectChip = (id: string) => {
		if (selectedId === id) {
			setSelectedId(null);
			setAmount('');
		} else {
			setSelectedId(id);
			setAmount('');
		}
	};

	const add = () => {
		if (!selectedProduct) return;
		const parsed = parseFloat(amount);
		if (!parsed || parsed <= 0) return;
		addLogEntry.mutate({
			date,
			mealTime,
			productId: selectedProduct.id,
			amount: toGrams(parsed, selectedProduct)
		});
		setSelectedId(null);
		setAmount('');
	};

	const cancel = () => {
		setSelectedId(null);
		setAmount('');
	};

	return {
		favoriteProducts,
		selectedProduct,
		selectedId,
		amount,
		setAmount,
		mealTime,
		setMealTime,
		selectChip,
		add,
		cancel
	};
}
