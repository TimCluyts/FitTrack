import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import {Field} from '../ui/Field';
import {useQuickRecipeEditor} from '../../hooks/useQuickRecipeEditor';
import type {Recipe, SimpleMacros} from '../../types/fitness';

interface QuickRecipeEditorProps {
	initial?: Recipe;
	onSave: (name: string, simpleMacros: SimpleMacros) => void;
	onCancel: () => void;
}

const macroFieldStyle = {flex: '1 1 80px'};

export function QuickRecipeEditor({initial, onSave, onCancel}: QuickRecipeEditorProps) {
	const {fields, setField, canSave, build} = useQuickRecipeEditor(initial);

	const handleSave = () => {
		const {name, simpleMacros} = build();
		onSave(name, simpleMacros);
	};

	return (
		<Card>
			<div style={{fontWeight: 600, fontSize: '15px', color: '#1b4332', marginBottom: '16px'}}>
				{initial ? 'Edit Quick Recipe' : 'New Quick Recipe'}
				<span style={{fontSize: '12px', fontWeight: 400, color: '#718096', marginLeft: '8px'}}>
					— macros per 100g, no ingredients needed
				</span>
			</div>

			<Field style={{marginBottom: '16px', maxWidth: '380px'}}>
				<Field.Label>Recipe name *</Field.Label>
				<Field.Input
					type="text"
					value={fields.name}
					onChange={e => setField('name', e.target.value)}
					onKeyDown={e => e.key === 'Enter' && canSave && handleSave()}
					placeholder="e.g. Chicken souvlaki"
					autoFocus
				/>
			</Field>

			<div style={{fontSize: '13px', fontWeight: 600, color: '#2d6a4f', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px'}}>
				Macros per 100g
			</div>

			<div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px'}}>
				<Field style={macroFieldStyle}>
					<Field.Label>Kcal</Field.Label>
					<Field.Input
						type="number" min="0" placeholder="0"
						value={fields.kcal}
						onChange={e => setField('kcal', e.target.value)}
					/>
				</Field>
				<Field style={macroFieldStyle}>
					<Field.Label>Protein (g)</Field.Label>
					<Field.Input
						type="number" min="0" step="0.1" placeholder="0"
						value={fields.protein}
						onChange={e => setField('protein', e.target.value)}
					/>
				</Field>
				<Field style={macroFieldStyle}>
					<Field.Label>Fat (g)</Field.Label>
					<Field.Input
						type="number" min="0" step="0.1" placeholder="0"
						value={fields.fat}
						onChange={e => setField('fat', e.target.value)}
					/>
				</Field>
				<Field style={macroFieldStyle}>
					<Field.Label>Carbs (g)</Field.Label>
					<Field.Input
						type="number" min="0" step="0.1" placeholder="0"
						value={fields.carbs}
						onChange={e => setField('carbs', e.target.value)}
					/>
				</Field>
			</div>

			<div style={{display: 'flex', gap: '8px'}}>
				<Button disabled={!canSave} onClick={handleSave}>
					Save Recipe
				</Button>
				<Button variant="outline" onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</Card>
	);
}
