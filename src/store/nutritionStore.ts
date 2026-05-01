import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import type {Product, LogEntry, Recipe} from '../types/fitness';

interface NutritionState {
	products: Product[];
	logEntries: LogEntry[];
	recipes: Recipe[];
	addProduct: (product: Omit<Product, 'id'>) => void;
	updateProduct: (id: string, updates: Partial<Omit<Product, 'id'>>) => void;
	deleteProduct: (id: string) => void;
	addLogEntry: (entry: Omit<LogEntry, 'id'>) => void;
	deleteLogEntry: (id: string) => void;
	addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
	updateRecipe: (id: string, updates: Partial<Omit<Recipe, 'id'>>) => void;
	deleteRecipe: (id: string) => void;
	importData: (data: {
		products: Product[];
		logEntries: LogEntry[];
		recipes?: Recipe[];
	}) => void;
}

export const useNutritionStore = create<NutritionState>()(
	persist(
		set => ({
			products: [],
			logEntries: [],
			recipes: [],

			addProduct: product =>
				set(state => ({
					products: [
						...state.products,
						{...product, id: crypto.randomUUID()}
					]
				})),

			updateProduct: (id, updates) =>
				set(state => ({
					products: state.products.map(p =>
						p.id === id ? {...p, ...updates} : p
					)
				})),

			deleteProduct: id =>
				set(state => ({
					products: state.products.filter(p => p.id !== id),
					logEntries: state.logEntries.filter(
						e => e.productId !== id
					),
					recipes: state.recipes.map(r => ({
						...r,
						ingredients: r.ingredients.filter(
							ing => ing.productId !== id
						)
					}))
				})),

			addLogEntry: entry =>
				set(state => ({
					logEntries: [
						...state.logEntries,
						{...entry, id: crypto.randomUUID()}
					]
				})),

			deleteLogEntry: id =>
				set(state => ({
					logEntries: state.logEntries.filter(e => e.id !== id)
				})),

			addRecipe: recipe =>
				set(state => ({
					recipes: [
						...state.recipes,
						{...recipe, id: crypto.randomUUID()}
					]
				})),

			updateRecipe: (id, updates) =>
				set(state => ({
					recipes: state.recipes.map(r =>
						r.id === id ? {...r, ...updates} : r
					)
				})),

			deleteRecipe: id =>
				set(state => ({
					recipes: state.recipes.filter(r => r.id !== id),
					logEntries: state.logEntries.filter(e => e.recipeId !== id)
				})),

			importData: data =>
				set({
					products: data.products,
					logEntries: data.logEntries,
					recipes: data.recipes ?? []
				})
		}),
		{name: 'fitness-data'}
	)
);
