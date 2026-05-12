import {useAddLogEntry, useDeleteLogEntry, useDeleteProduct} from './useApi';
import {calcMacros} from '../utils/macros';
import type {LogEntry, Product} from '../types/fitness';

interface ConvertOptions {
	alsoDeleteProduct: boolean;
	onDone: () => void;
}

export function useConvertToCustom(entry: LogEntry, product: Product | undefined) {
	const addEntry = useAddLogEntry();
	const deleteEntry = useDeleteLogEntry();
	const deleteProductMutation = useDeleteProduct();

	const convert = ({alsoDeleteProduct, onDone}: ConvertOptions) => {
		if (!product) return;
		const macros = calcMacros(product, entry.amount ?? 0);
		addEntry.mutate(
			{date: entry.date, mealTime: entry.mealTime, customEntry: {name: product.name, ...macros}},
			{
				onSuccess: () => {
					deleteEntry.mutate(entry.id);
					if (alsoDeleteProduct) deleteProductMutation.mutate(product.id);
					onDone();
				}
			}
		);
	};

	return {convert};
}
