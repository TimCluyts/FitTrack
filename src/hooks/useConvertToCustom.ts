import {useQueryClient, type QueryClient} from '@tanstack/react-query';
import {useUserStore} from '../store/userStore';
import {api} from '../utils/api';
import {calcMacros} from '../utils/macros';
import type {LogEntry, Product} from '../types/fitness';

interface ConvertOptions {
	alsoDeleteProduct: boolean;
	onDone: () => void;
}

async function convertEntryForUser(userId: string, entry: LogEntry, product: Product): Promise<void> {
	const macros = calcMacros(product, entry.amount ?? 0);
	await api.addLogEntry(userId, {date: entry.date, mealTime: entry.mealTime, customEntry: {name: product.name, ...macros}});
	await api.deleteLogEntry(userId, entry.id);
}

async function cascadeConvert(product: Product, qc: QueryClient): Promise<void> {
	const users = await api.getUsers();
	const logs = await Promise.all(users.map(u => api.getLog(u.id).then(entries => ({userId: u.id, entries}))));

	await Promise.all(
		logs.flatMap(({userId, entries}) =>
			entries
				.filter(e => e.productId === product.id)
				.map(e => convertEntryForUser(userId, e, product))
		)
	);

	await api.deleteProduct(product.id);
	await Promise.all([
		qc.invalidateQueries({queryKey: ['log']}),
		qc.invalidateQueries({queryKey: ['products']})
	]);
}

export function useConvertToCustom(entry: LogEntry, product: Product | undefined) {
	const qc = useQueryClient();
	const uid = useUserStore(s => s.activeUserId);

	const convert = ({alsoDeleteProduct, onDone}: ConvertOptions) => {
		if (!product || !uid) return;

		const run = async () => {
			await convertEntryForUser(uid, entry, product);

			if (alsoDeleteProduct) {
				await cascadeConvert(product, qc);
			} else {
				await qc.invalidateQueries({queryKey: ['log', uid]});
			}
		};

		run().then(onDone).catch(() => {
			void qc.invalidateQueries({queryKey: ['log']});
			onDone();
		});
	};

	return {convert};
}
