import {Field} from '../ui/Field';

interface ServingFieldsProps {
	servingSize: string;
	servingLabel: string;
	onField: (field: 'servingSize' | 'servingLabel', value: string) => void;
}

export function ServingFields({servingSize, servingLabel, onField}: ServingFieldsProps) {
	return (
		<div
			style={{
				borderTop: '1px solid #e8f0e9',
				paddingTop: '14px',
				marginBottom: '16px'
			}}>
			<div
				style={{
					fontSize: '12px',
					fontWeight: 600,
					color: '#718096',
					textTransform: 'uppercase',
					letterSpacing: '0.04em',
					marginBottom: '10px'
				}}>
				Serving (optional)
			</div>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
					gap: '12px'
				}}>
				<Field>
					<Field.Label>Serving size (g)</Field.Label>
					<Field.Input
						type="number"
						value={servingSize}
						placeholder="e.g. 25"
						min="0"
						step="0.5"
						onChange={e => onField('servingSize', e.target.value)}
					/>
				</Field>
				<Field>
					<Field.Label>Serving label (plural)</Field.Label>
					<Field.Input
						type="text"
						value={servingLabel}
						placeholder="e.g. slices, pieces"
						onChange={e => onField('servingLabel', e.target.value)}
					/>
				</Field>
			</div>
			<Field.Hint>
				When set, you can log by number of servings instead of grams.
			</Field.Hint>
		</div>
	);
}
