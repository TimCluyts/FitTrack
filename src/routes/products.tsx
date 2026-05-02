import {createFileRoute} from '@tanstack/react-router';
import {useState} from 'react';
import {useNutritionStore} from '../store/nutritionStore';
import {useLogStore} from '../store/logStore';
import {useWeightStore} from '../store/weightStore';
import {useTrainingStore} from '../store/trainingStore';
import {useProductForm} from '../hooks/useProductForm';
import {ProductForm} from '../components/products/ProductForm';
import {ProductTable} from '../components/products/ProductTable';
import {Button} from '../components/ui/Button';
import {Card} from '../components/ui/Card';
import {Field} from '../components/ui/Field';
import {PageHeader} from '../components/ui/PageHeader';
import {exportData, importFromFile} from '../utils/backup';

export const Route = createFileRoute('/products')({
	component: ProductsPage
});

function ProductsPage() {
	const {products, deleteProduct, importData: importNutrition} = useNutritionStore();
	const {importData: importLog} = useLogStore();
	const {importData: importWeight} = useWeightStore();
	const {importData: importTraining} = useTrainingStore();
	const form = useProductForm();
	const [search, setSearch] = useState('');

	const filtered = [...products].filter(p =>
		p.name.toLowerCase().includes(search.toLowerCase())
	);

	const handleImport = () =>
		importFromFile(data => {
			if (!confirm('This will replace all current data. Continue?')) return;
			importNutrition({products: data.products, recipes: data.recipes});
			if (data.logEntries) importLog({logEntries: data.logEntries});
			if (data.weightEntries) importWeight({weightEntries: data.weightEntries});
			if (data.exercises)
				importTraining({
					exercises: data.exercises,
					routines: data.routines ?? [],
					workoutLogs: data.workoutLogs ?? []
				});
		});

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
			<PageHeader title="Products">
				<Button variant="outline" onClick={exportData}>
					Export Backup
				</Button>
				<Button variant="outline" onClick={handleImport}>
					Import Backup
				</Button>
				{!form.visible && (
					<Button onClick={form.open}>+ Add Product</Button>
				)}
			</PageHeader>

			{form.visible && (
				<ProductForm
					form={form.form}
					onField={form.setField}
					isEditing={form.isEditing}
					onSubmit={form.submit}
					onCancel={form.cancel}
				/>
			)}

			<Card>
				<div style={{marginBottom: '14px'}}>
					<Field.Input
						type="text"
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder="Search products…"
						style={{maxWidth: '280px'}}
					/>
				</div>
				{filtered.length > 0 ? (
					<ProductTable
						products={filtered}
						onEdit={form.edit}
						onDelete={deleteProduct}
					/>
				) : (
					<div
						style={{
							textAlign: 'center',
							padding: '48px 24px',
							color: '#a0aec0'
						}}>
						{search
							? 'No products match your search.'
							: 'No products yet. Add your first one above.'}
					</div>
				)}
			</Card>
		</div>
	);
}
