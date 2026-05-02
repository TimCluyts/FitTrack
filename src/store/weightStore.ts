import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import type {WeightEntry} from '../types/fitness';

function getInitialKey(): string {
	try {
		const userId = JSON.parse(
			localStorage.getItem('user-prefs') ?? '{}'
		)?.state?.activeUserId;
		return userId ? `weight-data-${userId}` : 'weight-data-__none';
	} catch {
		return 'weight-data-__none';
	}
}

interface WeightState {
	weightEntries: WeightEntry[];
	addWeightEntry: (entry: Omit<WeightEntry, 'id'>) => void;
	deleteWeightEntry: (id: string) => void;
	importData: (data: {weightEntries: WeightEntry[]}) => void;
}

export const useWeightStore = create<WeightState>()(
	persist(
		set => ({
			weightEntries: [],

			addWeightEntry: entry =>
				set(state => ({
					weightEntries: [
						...state.weightEntries.filter(
							e => e.date !== entry.date
						),
						{...entry, id: crypto.randomUUID()}
					]
				})),

			deleteWeightEntry: id =>
				set(state => ({
					weightEntries: state.weightEntries.filter(e => e.id !== id)
				})),

			importData: data => set({weightEntries: data.weightEntries})
		}),
		{name: getInitialKey()}
	)
);
