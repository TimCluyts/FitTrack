import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import {Field} from '../ui/Field';
import {ServingFields} from './ServingFields';
import type {ProductFormData} from '../../hooks/useProductForm';

interface ProductFormProps {
	form: ProductFormData;
	onField: (field: keyof ProductFormData, value: string) => void;
	isEditing: boolean;
	onSubmit: () => void;
	onCancel: () => void;
}

const MACRO_FIELDS: {
	key: keyof ProductFormData;
	label: string;
	placeholder: string;
	step?: string;
}[] = [
	{key: 'name', label: 'Name *', placeholder: 'e.g. Whole wheat bread'},
	{key: 'kcal', label: 'Kcal / 100g *', placeholder: '265'},
	{key: 'protein', label: 'Protein / 100g', placeholder: '9.0', step: '0.1'},
	{key: 'fat', label: 'Fat / 100g', placeholder: '3.2', step: '0.1'},
	{key: 'carbs', label: 'Carbs / 100g', placeholder: '49.1', step: '0.1'}
];

export function ProductForm({
	form,
	onField,
	isEditing,
	onSubmit,
	onCancel
}: ProductFormProps) {
	return (
		<Card>
			<div
				style={{
					fontWeight: 600,
					fontSize: '15px',
					color: '#1b4332',
					marginBottom: '16px'
				}}>
				{isEditing ? 'Edit Product' : 'New Product'}
			</div>

			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
					gap: '12px',
					marginBottom: '16px'
				}}>
				{MACRO_FIELDS.map(({key, label, placeholder, step}) => (
					<Field key={key}>
						<Field.Label>{label}</Field.Label>
						<Field.Input
							type={key === 'name' ? 'text' : 'number'}
							value={form[key]}
							placeholder={placeholder}
							min={key !== 'name' ? '0' : undefined}
							step={step}
							onChange={e => onField(key, e.target.value)}
							onKeyDown={e => e.key === 'Enter' && onSubmit()}
							autoFocus={key === 'name'}
						/>
					</Field>
				))}
			</div>

			<ServingFields
				servingSize={form.servingSize}
				servingLabel={form.servingLabel}
				onField={onField}
			/>

			<div style={{display: 'flex', gap: '8px'}}>
				<Button
					disabled={!form.name.trim() || !form.kcal}
					onClick={onSubmit}>
					{isEditing ? 'Save Changes' : 'Add Product'}
				</Button>
				<Button variant="outline" onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</Card>
	);
}
