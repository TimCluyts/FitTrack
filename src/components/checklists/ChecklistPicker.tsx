import {useState} from 'react';
import {useAddChecklist} from '../../hooks/useApi';
import {accent, inputStyle} from './styles';
import {Button} from '../ui/Button';
import type {Checklist} from '../../types/checklist';
import {DEFAULT_CHECKLIST_EMOJI} from '../../types/checklist';

interface ChecklistPickerProps {
	checklists: Checklist[];
	selectedId: string | null;
	onSelect: (id: string) => void;
}

export function ChecklistPicker({checklists, selectedId, onSelect}: ChecklistPickerProps) {
	const addChecklist = useAddChecklist();
	const [adding, setAdding] = useState(false);
	const [name, setName] = useState('');

	const handleAdd = () => {
		const trimmed = name.trim();
		if (!trimmed) return;
		addChecklist.mutate(
			{name: trimmed, items: []},
			{onSuccess: created => onSelect(created.id)}
		);
		setName('');
		setAdding(false);
	};

	return (
		<div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center'}}>
			{checklists.map(checklist => {
				const active = checklist.id === selectedId;
				const done = checklist.items.filter(i => i.done).length;
				return (
					<button
						key={checklist.id}
						onClick={() => onSelect(checklist.id)}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							padding: '8px 14px',
							borderRadius: '20px',
							cursor: 'pointer',
							fontFamily: 'inherit',
							fontSize: '14px',
							fontWeight: active ? 600 : 400,
							background: active ? accent.main : 'white',
							color: active ? 'white' : accent.deep,
							border: `1px solid ${active ? accent.main : accent.border}`
						}}>
						<span>{checklist.emoji || DEFAULT_CHECKLIST_EMOJI}</span>
						{checklist.name}
						{checklist.items.length > 0 && (
							<span
								style={{
									fontSize: '12px',
									opacity: active ? 0.85 : 0.6,
									fontWeight: 400
								}}>
								{done}/{checklist.items.length}
							</span>
						)}
					</button>
				);
			})}

			{adding ? (
				<div style={{display: 'flex', gap: '6px', alignItems: 'center'}}>
					<input
						autoFocus
						value={name}
						onChange={e => setName(e.target.value)}
						onKeyDown={e => {
							if (e.key === 'Enter') handleAdd();
							if (e.key === 'Escape') setAdding(false);
						}}
						placeholder="Checklist name..."
						style={{...inputStyle, width: '180px'}}
					/>
					<Button
						size="sm"
						onClick={handleAdd}
						disabled={!name.trim()}
						style={{background: accent.main}}>
						Create
					</Button>
					<Button variant="outline" size="sm" onClick={() => setAdding(false)}
						style={{color: accent.main, borderColor: accent.border}}>
						Cancel
					</Button>
				</div>
			) : (
				<button
					onClick={() => setAdding(true)}
					style={{
						padding: '8px 14px',
						borderRadius: '20px',
						cursor: 'pointer',
						fontFamily: 'inherit',
						fontSize: '14px',
						background: 'transparent',
						color: accent.main,
						border: `1px dashed ${accent.border}`
					}}>
					＋ New list
				</button>
			)}
		</div>
	);
}
