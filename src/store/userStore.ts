import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export interface User {
	id: string;
	name: string;
}

interface UserState {
	activeUserId: string | null;
	setActiveUserId: (id: string) => void;
	clearActiveUser: () => void;
}

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			activeUserId: null,
			setActiveUserId: (id) => set({activeUserId: id}),
			clearActiveUser: () => set({activeUserId: null}),
		}),
		{name: 'user-prefs'}
	)
);
