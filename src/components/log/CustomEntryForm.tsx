import {Button} from '../ui/Button';
import {Field} from '../ui/Field';
import {MealSelect} from './MealSelect';
import type {CustomFields} from '../../hooks/useAddEntry';
import type {MealTime} from '../../types/fitness';

interface CustomEntryFormProps {
	readonly fields: CustomFields;
	readonly onFieldChange: (k: keyof CustomFields, v: string) => void;
	readonly mealTime: MealTime;
	readonly onMealChange: (v: MealTime) => void;
	readonly onSubmit: () => void;
	readonly canSubmit: boolean;
}

const macroFieldStyle = {flex: '1 1 70px'};

export function CustomEntryForm({
	fields,
	onFieldChange,
	mealTime,
	onMealChange,
	onSubmit,
	canSubmit
}: CustomEntryFormProps) {
	const handleKey = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') onSubmit();
	};

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
			<Field>
				<Field.Label>Description</Field.Label>
				<Field.Input
					placeholder="e.g. Pasta carbonara at restaurant"
					value={fields.name}
					onChange={e => onFieldChange('name', e.target.value)}
					onKeyDown={handleKey}
				/>
			</Field>
			<div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end'}}>
				<Field style={macroFieldStyle}>
					<Field.Label>Kcal</Field.Label>
					<Field.Input
						type="number"
						min="0"
						placeholder="0"
						value={fields.kcal}
						onChange={e => onFieldChange('kcal', e.target.value)}
						onKeyDown={handleKey}
					/>
				</Field>
				<Field style={macroFieldStyle}>
					<Field.Label>Protein (g)</Field.Label>
					<Field.Input
						type="number"
						min="0"
						step="0.1"
						placeholder="0"
						value={fields.protein}
						onChange={e => onFieldChange('protein', e.target.value)}
						onKeyDown={handleKey}
					/>
				</Field>
				<Field style={macroFieldStyle}>
					<Field.Label>Fat (g)</Field.Label>
					<Field.Input
						type="number"
						min="0"
						step="0.1"
						placeholder="0"
						value={fields.fat}
						onChange={e => onFieldChange('fat', e.target.value)}
						onKeyDown={handleKey}
					/>
				</Field>
				<Field style={macroFieldStyle}>
					<Field.Label>Carbs (g)</Field.Label>
					<Field.Input
						type="number"
						min="0"
						step="0.1"
						placeholder="0"
						value={fields.carbs}
						onChange={e => onFieldChange('carbs', e.target.value)}
						onKeyDown={handleKey}
					/>
				</Field>
				<MealSelect value={mealTime} onChange={onMealChange} />
				<Button
					disabled={!canSubmit}
					onClick={onSubmit}
					style={{alignSelf: 'flex-end', flexShrink: 0}}>
					Add
				</Button>
			</div>
		</div>
	);
}
