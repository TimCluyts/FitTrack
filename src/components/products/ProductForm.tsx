import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import {Field} from '../ui/Field';
import {ServingFields} from './ServingFields';
import type {ProductFormData} from '../../hooks/useProductForm';
import type {Product} from '../../types/fitness';

interface ProductFormProps {
	form: ProductFormData;
	onField: (field: keyof ProductFormData, value: string) => void;
	isEditing: boolean;
	similarProducts: Product[];
	onSubmit: () => void;
	onCancel: () => void;
}

const MACRO_FIELDS: {
	key: keyof ProductFormData;
	label: string;
	placeholder: string;
	step?: string;
}[] = [
	{key: 'kcal', label: 'Kcal / 100g *', placeholder: '265'},
	{key: 'protein', label: 'Protein / 100g', placeholder: '9.0', step: '0.1'},
	{key: 'fat', label: 'Fat / 100g', placeholder: '3.2', step: '0.1'},
	{key: 'carbs', label: 'Carbs / 100g', placeholder: '49.1', step: '0.1'}
];

export function ProductForm({
	form,
	onField,
	isEditing,
	similarProducts,
	onSubmit,
	onCancel
}: ProductFormProps) {
	return (
		<Card>
			<div style={{fontWeight: 600, fontSize: '15px', color: '#1b4332', marginBottom: '16px'}}>
				{isEditing ? 'Edit Product' : 'New Product'}
			</div>

			<Field style={{marginBottom: '12px'}}>
				<Field.Label>Name *</Field.Label>
				<Field.Input
					type="text"
					value={form.name}
					placeholder="e.g. Whole wheat bread"
					onChange={e => onField('name', e.target.value)}
					onKeyDown={e => e.key === 'Enter' && onSubmit()}
					autoFocus
				/>
				{similarProducts.length > 0 && (
					<div
						style={{
							marginTop: '6px',
							padding: '8px 10px',
							background: '#fffbeb',
							border: '1px solid #fcd34d',
							borderRadius: '6px',
							fontSize: '12px'
						}}>
						<div style={{fontWeight: 600, color: '#92400e', marginBottom: '4px'}}>
							⚠ Similar product{similarProducts.length > 1 ? 's' : ''} already in your list:
						</div>
						{similarProducts.map(p => (
							<div
								key={p.id}
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'baseline',
									gap: '8px',
									padding: '3px 0',
									borderTop: '1px solid #fef3c7',
									color: '#78350f'
								}}>
								<span style={{fontWeight: 500}}>{p.name}</span>
								<span style={{color: '#92400e', whiteSpace: 'nowrap'}}>
									{p.kcal} kcal · {p.protein}g prot · {p.fat}g fat · {p.carbs}g carbs
								</span>
							</div>
						))}
					</div>
				)}
			</Field>

			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
					gap: '12px',
					marginBottom: '16px'
				}}>
				{MACRO_FIELDS.map(({key, label, placeholder, step}) => (
					<Field key={key}>
						<Field.Label>{label}</Field.Label>
						<Field.Input
							type="number"
							value={form[key]}
							placeholder={placeholder}
							min="0"
							step={step}
							onChange={e => onField(key, e.target.value)}
							onKeyDown={e => e.key === 'Enter' && onSubmit()}
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
				<Button disabled={!form.name.trim() || !form.kcal} onClick={onSubmit}>
					{isEditing ? 'Save Changes' : 'Add Product'}
				</Button>
				<Button variant="outline" onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</Card>
	);
}
