import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {useLogStore} from './logStore';
import {useWeightStore} from './weightStore';
import {useTrainingStore} from './trainingStore';

export const USERS = [
	{id: 'tim', name: 'Tim'},
	{id: 'davine', name: 'Davine'}
] as const;

export type UserId = (typeof USERS)[number]['id'];

interface UserState {
	activeUserId: UserId | null;
	setActiveUser: (id: UserId) => Promise<void>;
	clearActiveUser: () => void;
}

export const useUserStore = create<UserState>()(
	persist(
		set => ({
			activeUserId: null,

			setActiveUser: async (id: UserId) => {
				useLogStore.persist.setOptions({name: `log-data-${id}`});
				useWeightStore.persist.setOptions({name: `weight-data-${id}`});
				useTrainingStore.persist.setOptions({name: `training-data-${id}`});
				await Promise.all([
					useLogStore.persist.rehydrate(),
					useWeightStore.persist.rehydrate(),
					useTrainingStore.persist.rehydrate()
				]);
				set({activeUserId: id});
			},

			clearActiveUser: () => set({activeUserId: null})
		}),
		{name: 'user-prefs'}
	)
);
