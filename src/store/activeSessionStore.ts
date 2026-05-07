import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import type {DraftExercise} from '../types/fitness';

export interface ActiveSession {
	routineId: string;
	routineName: string;
	date: string;
	draft: DraftExercise[];
	doneExerciseIds: string[];
}

interface ActiveSessionStore {
	session: ActiveSession | null;
	startSession: (session: ActiveSession) => void;
	updateSession: (patch: Partial<Pick<ActiveSession, 'date' | 'draft' | 'doneExerciseIds'>>) => void;
	clearSession: () => void;
}

export const useActiveSessionStore = create<ActiveSessionStore>()(
	persist(
		set => ({
			session: null,
			startSession: session => set({session}),
			updateSession: patch =>
				set(state =>
					state.session ? {session: {...state.session, ...patch}} : state
				),
			clearSession: () => set({session: null})
		}),
		{name: 'active-workout-session'}
	)
);
