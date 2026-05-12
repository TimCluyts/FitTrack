import {useToggleFavorite} from '../../hooks/useApi';
import {useFavoriteQuickAdd} from '../../hooks/useFavoriteQuickAdd';
import {FavoriteChip} from './FavoriteChip';
import {QuickAddPanel} from './QuickAddPanel';

interface FavoritesBarProps {
	date: string;
}

export function FavoritesBar({date}: FavoritesBarProps) {
	const toggleFavorite = useToggleFavorite();
	const {
		favoriteProducts,
		selectedProduct,
		selectedId,
		amount,
		setAmount,
		mealTime,
		setMealTime,
		selectChip,
		add,
		cancel
	} = useFavoriteQuickAdd(date);

	if (!favoriteProducts.length) return null;

	return (
		<div>
			<div
				style={{
					fontSize: '11px',
					fontWeight: 600,
					color: '#718096',
					textTransform: 'uppercase',
					letterSpacing: '0.06em',
					marginBottom: '8px'
				}}>
				Quick add
			</div>

			<div style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
				{favoriteProducts.map(p => (
					<FavoriteChip
						key={p.id}
						product={p}
						selected={p.id === selectedId}
						onClick={() => selectChip(p.id)}
						onRemove={() => toggleFavorite.mutate(p.id)}
					/>
				))}
			</div>

			<QuickAddPanel
				product={selectedProduct}
				amount={amount}
				onAmountChange={setAmount}
				mealTime={mealTime}
				onMealChange={setMealTime}
				onAdd={add}
				onCancel={cancel}
			/>
		</div>
	);
}
