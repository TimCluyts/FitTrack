import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import type {LogEntry} from '../types/fitness';

function getInitialKey(): string {
	try {
		const userId = JSON.parse(
			localStorage.getItem('user-prefs') ?? '{}'
		)?.state?.activeUserId;
		return userId ? `log-data-${userId}` : 'log-data-__none';
	} catch {
		return 'log-data-__none';
	}
}

interface LogState {
	logEntries: LogEntry[];
	addLogEntry: (entry: Omit<LogEntry, 'id'>) => void;
	deleteLogEntry: (id: string) => void;
	importData: (data: {logEntries?: LogEntry[]}) => void;
}

export const useLogStore = create<LogState>()(
	persist(
		set => ({
			logEntries: [],

			addLogEntry: entry =>
				set(state => ({
					logEntries: [
						...state.logEntries,
						{...entry, id: crypto.randomUUID()}
					]
				})),

			deleteLogEntry: id =>
				set(state => ({
					logEntries: state.logEntries.filter(e => e.id !== id)
				})),

			importData: data => set({logEntries: data.logEntries ?? []})
		}),
		{name: getInitialKey()}
	)
);
