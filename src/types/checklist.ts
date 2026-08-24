// Checklists are a self-contained corner of the app — reusable, resettable
// lists (pizza night, camping trip, …). They share nothing with the fitness
// data model on purpose, so their types live apart from types/fitness.ts.

export interface ChecklistItem {
	id: string;
	text: string;
	done: boolean;
}

export interface Checklist {
	id: string;
	name: string;
	emoji?: string;
	items: ChecklistItem[];
	runCount: number;
	lastResetAt?: string; // ISO timestamp of the last reset
}

export const DEFAULT_CHECKLIST_EMOJI = '📋';

// New items are sent without an id — the server assigns one.
export type ChecklistItemDraft = Omit<ChecklistItem, 'id'> & {id?: string};

export interface ChecklistDraft {
	name: string;
	emoji?: string;
	items: ChecklistItemDraft[];
}
