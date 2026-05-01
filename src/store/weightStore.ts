import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import type {WeightEntry} from '../types/fitness';

interface WeightState {
	weightEntries: WeightEntry[];
	addWeightEntry: (entry: Omit<WeightEntry, 'id'>) => void;
	deleteWeightEntry: (id: string) => void;
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
				}))
		}),
		{name: 'weight-data'}
	)
);
