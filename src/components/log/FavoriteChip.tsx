import type {Product} from '../../types/fitness';

interface FavoriteChipProps {
	product: Product;
	selected: boolean;
	onClick: () => void;
	onRemove: () => void;
}

export function FavoriteChip({product, selected, onClick, onRemove}: FavoriteChipProps) {
	return (
		<div
			onClick={onClick}
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: '5px',
				background: selected ? 'linear-gradient(135deg, #2d6a4f, #40916c)' : 'white',
				border: selected ? 'none' : '1px solid #c6e0d4',
				borderRadius: '20px',
				padding: '5px 10px 5px 12px',
				cursor: 'pointer',
				fontSize: '13px',
				color: selected ? 'white' : '#2d6a4f',
				fontWeight: selected ? 600 : 400,
				boxShadow: selected
					? '0 2px 8px rgba(45,106,79,0.30)'
					: '0 1px 2px rgba(0,0,0,0.06)',
				transition: 'all 0.15s ease',
				userSelect: 'none',
				flexShrink: 0
			}}>
			<span style={{fontSize: '11px', opacity: selected ? 1 : 0.7}}>★</span>
			<span>{product.name}</span>
			<button
				onClick={e => {
					e.stopPropagation();
					onRemove();
				}}
				title="Remove from favorites"
				style={{
					background: 'none',
					border: 'none',
					cursor: 'pointer',
					color: selected ? 'rgba(255,255,255,0.6)' : '#b0c4bb',
					fontSize: '15px',
					padding: '0 0 0 3px',
					lineHeight: 1,
					fontFamily: 'inherit',
					display: 'flex',
					alignItems: 'center'
				}}>
				×
			</button>
		</div>
	);
}
