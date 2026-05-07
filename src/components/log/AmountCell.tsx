import {useState} from 'react';
import {DataTable} from '../ui/DataTable';
import {toGrams} from '../../utils/serving';
import type {Product} from '../../types/fitness';

interface AmountCellProps {
	display: string;
	amount: number;
	product?: Product;
	onSave: (v: number) => void;
}

export function AmountCell({display, amount, product, onSave}: AmountCellProps) {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState('');

	const inServings = !!product?.servingSize;
	const unit = inServings ? (product!.servingLabel ?? 'serving') : 'g';
	const editValue = inServings
		? Math.round((amount / product!.servingSize!) * 10) / 10
		: amount;

	function startEdit() {
		setDraft(String(editValue));
		setEditing(true);
	}

	function commit() {
		const v = parseFloat(draft);
		if (!isNaN(v) && v > 0) {
			const grams = inServings ? toGrams(v, product) : v;
			if (grams !== amount) onSave(grams);
		}
		setEditing(false);
	}

	function onKeyDown(e: React.KeyboardEvent) {
		if (e.key === 'Enter') commit();
		if (e.key === 'Escape') setEditing(false);
	}

	if (editing) {
		return (
			<DataTable.Cell align="right">
				<span style={{display: 'inline-flex', alignItems: 'center', gap: '3px'}}>
					<input
						type="number"
						min={1}
						value={draft}
						autoFocus
						onChange={e => setDraft(e.target.value)}
						onBlur={commit}
						onKeyDown={onKeyDown}
						style={{
							width: '56px',
							textAlign: 'right',
							fontSize: '13px',
							border: '1px solid #2d6a4f',
							borderRadius: '4px',
							padding: '1px 4px'
						}}
					/>
					<span style={{fontSize: '12px', color: '#718096'}}>{unit}</span>
				</span>
			</DataTable.Cell>
		);
	}

	return (
		<DataTable.Cell align="right">
			<span
				onClick={startEdit}
				title="Click to edit"
				style={{cursor: 'pointer', borderBottom: '1px dashed #a0aec0'}}>
				{display}
			</span>
		</DataTable.Cell>
	);
}
