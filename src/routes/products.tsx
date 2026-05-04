import {createFileRoute} from '@tanstack/react-router';
import {useState} from 'react';
import {useProducts, useDeleteProduct, useFavorites, useToggleFavorite} from '../hooks/useApi';
import {useProductForm} from '../hooks/useProductForm';
import {ProductForm} from '../components/products/ProductForm';
import {ProductTable} from '../components/products/ProductTable';
import {Button} from '../components/ui/Button';
import {Card} from '../components/ui/Card';
import {Field} from '../components/ui/Field';
import {PageHeader} from '../components/ui/PageHeader';
import {exportServerData, importServerData} from '../utils/backup';

export const Route = createFileRoute('/products')({
	component: ProductsPage
});

function ProductsPage() {
	const {data: products = []} = useProducts();
	const deleteProduct = useDeleteProduct();
	const form = useProductForm();
	const [search, setSearch] = useState('');
	const {data: favoriteIds = []} = useFavorites();
	const toggleFavorite = useToggleFavorite();

	const filtered = [...products].filter(p =>
		p.name.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
			<PageHeader title="Products">
				<Button variant="outline" onClick={exportServerData}>
					Export Backup
				</Button>
				<Button variant="outline" onClick={importServerData}>
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
						onDelete={(id) => deleteProduct.mutate(id)}
						favoriteIds={favoriteIds}
						onToggleFavorite={(id) => toggleFavorite.mutate(id)}
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
