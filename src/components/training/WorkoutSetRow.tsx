import {Button} from '../ui/Button';
import {Field} from '../ui/Field';
import type {DraftSet} from '../../types/fitness';

interface WorkoutSetRowProps {
	index: number;
	set: DraftSet;
	canRemove: boolean;
	onUpdate: (field: 'weight' | 'reps', value: string) => void;
	onRemove: () => void;
}

export function WorkoutSetRow({
	index,
	set,
	canRemove,
	onUpdate,
	onRemove
}: WorkoutSetRowProps) {
	return (
		<tr>
			<td
				style={{
					textAlign: 'center',
					padding: '6px 8px',
					color: '#718096',
					width: '32px'
				}}>
				{index + 1}
			</td>
			<td style={{padding: '6px 8px'}}>
				<Field.Input
					type="number"
					value={set.weight}
					placeholder="kg"
					min="0"
					step="0.5"
					style={{width: '90px'}}
					onChange={e => onUpdate('weight', e.target.value)}
				/>
			</td>
			<td style={{padding: '6px 8px'}}>
				<Field.Input
					type="number"
					value={set.reps}
					placeholder="reps"
					min="1"
					step="1"
					style={{width: '70px'}}
					onChange={e => onUpdate('reps', e.target.value)}
				/>
			</td>
			<td style={{textAlign: 'center', padding: '6px 4px'}}>
				{canRemove && (
					<Button
						variant="ghost-danger"
						size="sm"
						onClick={onRemove}
						style={{fontSize: '14px', padding: '2px 5px', lineHeight: 1}}>
						×
					</Button>
				)}
			</td>
		</tr>
	);
}
