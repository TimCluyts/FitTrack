import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface FavoritesState {
	favorites: Record<string, string[]>; // userId -> productId[]
	toggleFavorite: (userId: string, productId: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
	persist(
		set => ({
			favorites: {},
			toggleFavorite: (userId, productId) =>
				set(s => {
					const current = s.favorites[userId] ?? [];
					const exists = current.includes(productId);
					return {
						favorites: {
							...s.favorites,
							[userId]: exists
								? current.filter(id => id !== productId)
								: [...current, productId]
						}
					};
				})
		}),
		{name: 'favorites'}
	)
);
