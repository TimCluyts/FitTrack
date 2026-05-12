import {useMemo} from 'react';
import {useProducts, useRecipes, useLogEntries, useGoals} from './useApi';
import {getEntryMacros, sumMacros} from '../utils/macros';
import {activeGoalForDate} from '../utils/goalPeriods';
import type {MacroTotals} from '../types/fitness';

export function useNutritionChartData() {
	const {data: products = []} = useProducts();
	const {data: recipes = []} = useRecipes();
	const {data: logEntries = []} = useLogEntries();
	const {data: goalPeriods = []} = useGoals();

	return useMemo(() => {
		const dayMap = new Map<string, MacroTotals>();
		for (const entry of logEntries) {
			const macros = getEntryMacros(entry, products, recipes);
			if (!macros) continue;
			const prev = dayMap.get(entry.date) ?? {kcal: 0, protein: 0, fat: 0, carbs: 0};
			dayMap.set(entry.date, sumMacros([prev, macros]));
		}
		const allDays = [...dayMap.entries()]
			.map(([date, totals]) => ({date, ...totals}))
			.sort((a, b) => a.date.localeCompare(b.date));

		const chartDays = allDays.slice(-30).map(d => {
			const goal = activeGoalForDate(goalPeriods, d.date);
			return {
				...d,
				label: d.date.slice(5).replace('-', '/'),
				goalKcalMin: goal?.kcalMin,
				goalKcalMax: goal?.kcalMax,
				goalProtein: goal?.protein,
				goalFat: goal?.fat,
				goalCarbs: goal?.carbs
			};
		});

		return {allDays, chartDays};
	}, [logEntries, products, recipes, goalPeriods]);
}
