import {accent} from './styles';
import type {Checklist} from '../../types/checklist';

interface ChecklistRunnerProps {
	checklist: Checklist;
	onToggle: (itemId: string) => void;
}

export function ChecklistRunner({checklist, onToggle}: ChecklistRunnerProps) {
	if (checklist.items.length === 0) {
		return (
			<div style={{fontSize: '14px', color: accent.muted, padding: '8px 0'}}>
				Nothing on this list yet — switch to <strong>Edit</strong> to add items.
			</div>
		);
	}

	return (
		<div style={{display: 'flex', flexDirection: 'column'}}>
			{checklist.items.map(item => (
				<label
					key={item.id}
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '12px',
						padding: '10px 8px',
						borderRadius: '6px',
						cursor: 'pointer',
						borderBottom: '1px solid #f2ede8'
					}}>
					<input
						type="checkbox"
						checked={item.done}
						onChange={() => onToggle(item.id)}
						style={{
							width: '20px',
							height: '20px',
							accentColor: accent.main,
							cursor: 'pointer',
							flexShrink: 0
						}}
					/>
					<span
						style={{
							fontSize: '15px',
							color: item.done ? accent.muted : '#2d3748',
							textDecoration: item.done ? 'line-through' : 'none'
						}}>
						{item.text}
					</span>
				</label>
			))}
		</div>
	);
}
