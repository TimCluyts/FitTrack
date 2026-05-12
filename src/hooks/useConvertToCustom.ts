import {useQueryClient} from '@tanstack/react-query';
import {useUserStore} from '../store/userStore';
import {api} from '../utils/api';
import {calcMacros} from '../utils/macros';
import type {LogEntry, Product} from '../types/fitness';

interface ConvertOptions {
	alsoDeleteProduct: boolean;
	onDone: () => void;
}

export function useConvertToCustom(entry: LogEntry, product: Product | undefined) {
	const qc = useQueryClient();
	const uid = useUserStore(s => s.activeUserId);

	const convert = ({alsoDeleteProduct, onDone}: ConvertOptions) => {
		if (!product || !uid) return;

		void (async () => {
			const macros = calcMacros(product, entry.amount ?? 0);

			// Convert the current entry
			await api.addLogEntry(uid, {
				date: entry.date,
				mealTime: entry.mealTime,
				customEntry: {name: product.name, ...macros}
			});
			await api.deleteLogEntry(uid, entry.id);

			if (alsoDeleteProduct) {
				// Cascade: convert every other log entry referencing this product across all users.
				// The current entry is already deleted above so it won't appear in the fetch below.
				const users = await api.getUsers();
				for (const user of users) {
					const log = await api.getLog(user.id);
					const affected = log.filter(e => e.productId === product.id);
					for (const e of affected) {
						const m = calcMacros(product, e.amount ?? 0);
						await api.addLogEntry(user.id, {
							date: e.date,
							mealTime: e.mealTime,
							customEntry: {name: product.name, ...m}
						});
						await api.deleteLogEntry(user.id, e.id);
					}
				}
				await api.deleteProduct(product.id);
				// Invalidate all users' logs and the products list
				await qc.invalidateQueries({queryKey: ['log']});
				await qc.invalidateQueries({queryKey: ['products']});
			} else {
				await qc.invalidateQueries({queryKey: ['log', uid]});
			}

			onDone();
		})();
	};

	return {convert};
}
