import {
	useUpdateChecklist,
	useResetChecklist,
	useDeleteChecklist
} from './useApi';
import type {Checklist, ChecklistItemDraft} from '../types/checklist';

/**
 * All the ways a single checklist can change. Items are always written as a
 * whole array — the server assigns ids to any item that doesn't have one yet.
 */
export function useChecklistActions(checklist: Checklist) {
	const update = useUpdateChecklist();
	const resetMutation = useResetChecklist();
	const deleteMutation = useDeleteChecklist();

	const putItems = (items: ChecklistItemDraft[]) =>
		update.mutate({id: checklist.id, data: {items}});

	const moveItem = (itemId: string, direction: -1 | 1) => {
		const index = checklist.items.findIndex(i => i.id === itemId);
		const target = index + direction;
		if (index === -1 || target < 0 || target >= checklist.items.length) return;
		const items = [...checklist.items];
		const moved = items[index];
		const displaced = items[target];
		if (!moved || !displaced) return;
		items[index] = displaced;
		items[target] = moved;
		putItems(items);
	};

	return {
		toggleItem: (itemId: string) =>
			putItems(
				checklist.items.map(i =>
					i.id === itemId ? {...i, done: !i.done} : i
				)
			),
		addItem: (text: string) => putItems([...checklist.items, {text, done: false}]),
		renameItem: (itemId: string, text: string) =>
			putItems(checklist.items.map(i => (i.id === itemId ? {...i, text} : i))),
		removeItem: (itemId: string) =>
			putItems(checklist.items.filter(i => i.id !== itemId)),
		moveItem,
		rename: (name: string) => update.mutate({id: checklist.id, data: {name}}),
		setEmoji: (emoji: string) => update.mutate({id: checklist.id, data: {emoji}}),
		reset: () => resetMutation.mutate(checklist.id),
		remove: () => deleteMutation.mutate(checklist.id),
		isResetting: resetMutation.isPending
	};
}
