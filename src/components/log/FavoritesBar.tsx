import {useMemo, useState} from 'react';
import {useAddLogEntry} from '../../hooks/useApi';
import {useFavoritesStore} from '../../store/favoritesStore';
import {useUserStore} from '../../store/userStore';
import {IngredientAmountInput} from '../ServingInput';
import {MealSelect} from './MealSelect';
import {Button} from '../ui/Button';
import {toGrams} from '../../utils/serving';
import type {MealTime, Product} from '../../types/fitness';

interface FavoritesBarProps {
	products: Product[];
	date: string;
}

interface ChipProps {
	product: Product;
	date: string;
	onRemove: () => void;
}

function FavoriteChip({product, date, onRemove}: ChipProps) {
	const [expanded, setExpanded] = useState(false);
	const [amount, setAmount] = useState('');
	const [mealTime, setMealTime] = useState<MealTime>('morning');
	const addLogEntry = useAddLogEntry();

	const handleAdd = () => {
		const parsed = parseFloat(amount);
		if (!parsed || parsed <= 0) return;
		addLogEntry.mutate({
			date,
			mealTime,
			productId: product.id,
			amount: toGrams(parsed, product)
		});
		setExpanded(false);
		setAmount('');
	};

	if (!expanded) {
		return (
			<div
				style={{
					display: 'inline-flex',
					alignItems: 'center',
					gap: '4px',
					background: '#f0f7f4',
					border: '1px solid #c6e0d4',
					borderRadius: '20px',
					padding: '4px 10px 4px 12px',
					cursor: 'pointer',
					fontSize: '13px',
					color: '#2d6a4f'
				}}
				onClick={() => setExpanded(true)}>
				<span>★</span>
				<span>{product.name}</span>
				<button
					onClick={e => {
						e.stopPropagation();
						onRemove();
					}}
					style={{
						background: 'none',
						border: 'none',
						cursor: 'pointer',
						color: '#a0aec0',
						fontSize: '14px',
						padding: '0 0 0 4px',
						lineHeight: 1,
						fontFamily: 'inherit'
					}}
					title="Remove from favorites">
					×
				</button>
			</div>
		);
	}

	return (
		<div
			style={{
				background: '#f0f7f4',
				border: '1px solid #c6e0d4',
				borderRadius: '8px',
				padding: '10px 12px',
				display: 'flex',
				gap: '8px',
				alignItems: 'flex-end',
				flexWrap: 'wrap'
			}}>
			<div
				style={{
					fontSize: '13px',
					fontWeight: 600,
					color: '#1b4332',
					alignSelf: 'center',
					minWidth: '80px'
				}}>
				{product.name}
			</div>
			<IngredientAmountInput
				product={product}
				value={amount}
				onChange={setAmount}
				onEnter={handleAdd}
			/>
			<MealSelect value={mealTime} onChange={setMealTime} />
			<Button
				variant="secondary"
				onClick={handleAdd}
				disabled={!amount}
				style={{alignSelf: 'flex-end'}}>
				+ Add
			</Button>
			<Button
				variant="outline"
				onClick={() => {
					setExpanded(false);
					setAmount('');
				}}
				style={{alignSelf: 'flex-end'}}>
				Cancel
			</Button>
		</div>
	);
}

export function FavoritesBar({products, date}: FavoritesBarProps) {
	const activeUserId = useUserStore(s => s.activeUserId);
	const {favorites, toggleFavorite} = useFavoritesStore();
	const favoriteIds = activeUserId ? (favorites[activeUserId] ?? []) : [];
	const favoriteProducts = useMemo(
		() =>
			favoriteIds
				.map(id => products.find(p => p.id === id))
				.filter((p): p is Product => p !== undefined),
		[favoriteIds, products]
	);

	if (!favoriteProducts.length || !activeUserId) return null;

	return (
		<div>
			<div
				style={{
					fontSize: '11px',
					fontWeight: 600,
					color: '#718096',
					textTransform: 'uppercase',
					letterSpacing: '0.06em',
					marginBottom: '6px'
				}}>
				Quick add
			</div>
			<div style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
				{favoriteProducts.map(p => (
					<FavoriteChip
						key={p.id}
						product={p}
						date={date}
						onRemove={() => toggleFavorite(activeUserId, p.id)}
					/>
				))}
			</div>
		</div>
	);
}
