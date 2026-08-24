import {useState} from 'react';
import {Card} from '../ui/Card';
import {Button} from '../ui/Button';
import {ChecklistRunner} from './ChecklistRunner';
import {ChecklistItemsEditor} from './ChecklistItemsEditor';
import {useChecklistActions} from '../../hooks/useChecklistActions';
import {accent, inputStyle} from './styles';
import type {Checklist} from '../../types/checklist';
import {DEFAULT_CHECKLIST_EMOJI} from '../../types/checklist';

interface ChecklistCardProps {
	checklist: Checklist;
	onDeleted: () => void;
}

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString(undefined, {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
}

function ProgressBar({done, total}: {done: number; total: number}) {
	const pct = total === 0 ? 0 : Math.round((done / total) * 100);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
			<div
				style={{
					flex: 1,
					height: '8px',
					borderRadius: '4px',
					background: '#f0eae4',
					overflow: 'hidden'
				}}>
				<div
					style={{
						width: `${pct}%`,
						height: '100%',
						background: done === total && total > 0 ? '#2d6a4f' : accent.main,
						transition: 'width 0.2s'
					}}
				/>
			</div>
			<span style={{fontSize: '13px', color: accent.muted, whiteSpace: 'nowrap'}}>
				{done} / {total}
			</span>
		</div>
	);
}

export function ChecklistCard({checklist, onDeleted}: ChecklistCardProps) {
	const actions = useChecklistActions(checklist);
	const [mode, setMode] = useState<'run' | 'edit'>('run');
	const [nameDraft, setNameDraft] = useState<string | null>(null);

	const done = checklist.items.filter(i => i.done).length;
	const total = checklist.items.length;
	const allDone = total > 0 && done === total;

	const handleReset = () => {
		if (done === 0) return;
		if (
			!allDone &&
			!confirm(`Reset "${checklist.name}"? ${done} ticked item(s) will be unchecked.`)
		)
			return;
		actions.reset();
	};

	const handleDelete = () => {
		if (!confirm(`Delete the "${checklist.name}" checklist for good?`)) return;
		actions.remove();
		onDeleted();
	};

	const commitName = () => {
		const next = nameDraft?.trim();
		if (next && next !== checklist.name) actions.rename(next);
		setNameDraft(null);
	};

	return (
		<Card style={{borderTop: `3px solid ${accent.main}`}}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexWrap: 'wrap',
					gap: '10px',
					marginBottom: '12px'
				}}>
				{mode === 'edit' ? (
					<div style={{display: 'flex', gap: '8px', alignItems: 'center', flex: 1}}>
						<input
							value={checklist.emoji || ''}
							onChange={e => actions.setEmoji(e.target.value.slice(0, 2))}
							aria-label="Checklist emoji"
							placeholder={DEFAULT_CHECKLIST_EMOJI}
							style={{...inputStyle, width: '52px', textAlign: 'center', fontSize: '18px'}}
						/>
						<input
							value={nameDraft ?? checklist.name}
							onChange={e => setNameDraft(e.target.value)}
							onBlur={commitName}
							onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
							aria-label="Checklist name"
							style={{...inputStyle, maxWidth: '280px', fontWeight: 600}}
						/>
					</div>
				) : (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '10px',
							fontSize: '18px',
							fontWeight: 600,
							color: accent.deep
						}}>
						<span style={{fontSize: '22px'}}>
							{checklist.emoji || DEFAULT_CHECKLIST_EMOJI}
						</span>
						{checklist.name}
					</div>
				)}

				<div style={{display: 'flex', gap: '8px'}}>
					<Button
						variant={mode === 'edit' ? 'primary' : 'outline'}
						size="sm"
						onClick={() => setMode(mode === 'edit' ? 'run' : 'edit')}
						style={
							mode === 'edit'
								? {background: accent.main}
								: {color: accent.main, borderColor: accent.border}
						}>
						{mode === 'edit' ? 'Done editing' : 'Edit'}
					</Button>
					{mode === 'edit' && (
						<Button
							variant="outline"
							size="sm"
							onClick={handleDelete}
							style={{color: '#c53030', borderColor: '#fca5a5'}}>
							Delete list
						</Button>
					)}
				</div>
			</div>

			{total > 0 && mode === 'run' && (
				<div style={{marginBottom: '14px'}}>
					<ProgressBar done={done} total={total} />
				</div>
			)}

			{mode === 'run' ? (
				<ChecklistRunner checklist={checklist} onToggle={actions.toggleItem} />
			) : (
				<ChecklistItemsEditor
					checklist={checklist}
					onRenameItem={actions.renameItem}
					onRemoveItem={actions.removeItem}
					onMoveItem={actions.moveItem}
					onAddItem={actions.addItem}
				/>
			)}

			{mode === 'run' && (
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						flexWrap: 'wrap',
						gap: '10px',
						marginTop: '16px',
						paddingTop: '14px',
						borderTop: '1px solid #f2ede8'
					}}>
					<div style={{fontSize: '12px', color: accent.muted}}>
						{allDone && <span style={{color: '#2d6a4f', fontWeight: 600}}>All done 🎉 </span>}
						{checklist.runCount > 0 && `Reset ${checklist.runCount}× · `}
						{checklist.lastResetAt
							? `last reset ${formatDate(checklist.lastResetAt)}`
							: 'never reset yet'}
					</div>
					<Button
						size="sm"
						variant={allDone ? 'primary' : 'outline'}
						onClick={handleReset}
						disabled={done === 0 || actions.isResetting}
						style={
							allDone
								? {background: accent.main}
								: {color: accent.main, borderColor: accent.border}
						}>
						↺ Reset for next time
					</Button>
				</div>
			)}
		</Card>
	);
}
