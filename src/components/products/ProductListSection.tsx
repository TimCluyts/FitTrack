import {useState} from 'react';
import {useProducts, useDeleteProduct, useFavorites, useToggleFavorite} from '../../hooks/useApi';
import {ProductTable} from './ProductTable';
import {Field} from '../ui/Field';
import {Card} from '../ui/Card';
import type {Product} from '../../types/fitness';

interface ProductListSectionProps {
	onEdit: (product: Product) => void;
}

export function ProductListSection({onEdit}: ProductListSectionProps) {
	const {data: products = []} = useProducts();
	const deleteProduct = useDeleteProduct();
	const {data: favoriteIds = []} = useFavorites();
	const toggleFavorite = useToggleFavorite();
	const [search, setSearch] = useState('');

	const filtered = [...products].filter(p =>
		p.name.toLowerCase().includes(search.toLowerCase())
	);

	return (
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
					onEdit={onEdit}
					onDelete={id => deleteProduct.mutate(id)}
					favoriteIds={favoriteIds}
					onToggleFavorite={id => toggleFavorite.mutate(id)}
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
	);
}
