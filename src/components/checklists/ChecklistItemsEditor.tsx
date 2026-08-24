import {useState} from 'react';
import {accent, inputStyle} from './styles';
import {Button} from '../ui/Button';
import type {Checklist} from '../../types/checklist';

interface ChecklistItemsEditorProps {
	checklist: Checklist;
	onRenameItem: (itemId: string, text: string) => void;
	onRemoveItem: (itemId: string) => void;
	onMoveItem: (itemId: string, direction: -1 | 1) => void;
	onAddItem: (text: string) => void;
}

const iconButtonStyle: React.CSSProperties = {
	background: 'none',
	border: 'none',
	cursor: 'pointer',
	fontSize: '15px',
	lineHeight: 1,
	padding: '4px 6px',
	color: accent.muted,
	fontFamily: 'inherit'
};

export function ChecklistItemsEditor({
	checklist,
	onRenameItem,
	onRemoveItem,
	onMoveItem,
	onAddItem
}: ChecklistItemsEditorProps) {
	const [newItem, setNewItem] = useState('');
	// Only the row being typed in is uncontrolled from the server data.
	const [draft, setDraft] = useState<{id: string; text: string} | null>(null);

	const handleAdd = () => {
		const text = newItem.trim();
		if (!text) return;
		onAddItem(text);
		setNewItem('');
	};

	const commitDraft = () => {
		if (!draft) return;
		const text = draft.text.trim();
		const current = checklist.items.find(i => i.id === draft.id);
		if (text && current && text !== current.text) onRenameItem(draft.id, text);
		setDraft(null);
	};

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
			{checklist.items.map((item, index) => (
				<div key={item.id} style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
					<input
						value={draft?.id === item.id ? draft.text : item.text}
						onChange={e => setDraft({id: item.id, text: e.target.value})}
						onFocus={() => setDraft({id: item.id, text: item.text})}
						onBlur={commitDraft}
						onKeyDown={e => {
							if (e.key === 'Enter') e.currentTarget.blur();
							if (e.key === 'Escape') setDraft(null);
						}}
						style={inputStyle}
					/>
					<button
						onClick={() => onMoveItem(item.id, -1)}
						disabled={index === 0}
						aria-label="Move up"
						style={{...iconButtonStyle, opacity: index === 0 ? 0.3 : 1}}>
						↑
					</button>
					<button
						onClick={() => onMoveItem(item.id, 1)}
						disabled={index === checklist.items.length - 1}
						aria-label="Move down"
						style={{
							...iconButtonStyle,
							opacity: index === checklist.items.length - 1 ? 0.3 : 1
						}}>
						↓
					</button>
					<button
						onClick={() => onRemoveItem(item.id)}
						aria-label={`Remove ${item.text}`}
						style={{...iconButtonStyle, color: '#c53030', fontSize: '17px'}}>
						×
					</button>
				</div>
			))}

			<div style={{display: 'flex', gap: '8px', marginTop: '6px'}}>
				<input
					value={newItem}
					onChange={e => setNewItem(e.target.value)}
					onKeyDown={e => e.key === 'Enter' && handleAdd()}
					placeholder="Add an item..."
					style={inputStyle}
				/>
				<Button
					size="sm"
					onClick={handleAdd}
					disabled={!newItem.trim()}
					style={{background: accent.main, flexShrink: 0}}>
					Add
				</Button>
			</div>
		</div>
	);
}
