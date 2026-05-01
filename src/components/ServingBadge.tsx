import type {Product} from '../types/fitness';

export function ServingBadge({product}: {product: Product}) {
	if (!product.servingSize) return <span style={{color: '#cbd5e0'}}>—</span>;
	return (
		<span>
			{product.servingSize}g
			{product.servingLabel ? ` / ${product.servingLabel}` : ''}
		</span>
	);
}
