import {useMemo} from 'react';
import {useProducts, useRecipes, useLogEntries, useGoals, useDeleteLogEntry, useUpdateLogEntry} from '../../hooks/useApi';
import {getEntryMacros, sumMacros} from '../../utils/macros';
import {MealSection} from './MealSection';
import {MacroBar} from '../MacroBar';
import {Card} from '../ui/Card';
import {MEAL_TIMES, type MacroTotals} from '../../types/fitness';

interface DayMealsSectionProps {
	date: string;
}

export function DayMealsSection({date}: DayMealsSectionProps) {
	const {data: products = []} = useProducts();
	const {data: recipes = []} = useRecipes();
	const {data: logEntries = []} = useLogEntries();
	const {data: goals} = useGoals();
	const deleteLogEntry = useDeleteLogEntry();
	const updateLogEntry = useUpdateLogEntry();

	const dayEntries = useMemo(
		() => logEntries.filter(e => e.date === date),
		[logEntries, date]
	);

	const totals = useMemo(
		() =>
			sumMacros(
				dayEntries
					.map(e => getEntryMacros(e, products, recipes))
					.filter((m): m is MacroTotals => m !== null)
			),
		[dayEntries, products, recipes]
	);

	if (!dayEntries.length) {
		return (
			<Card style={{textAlign: 'center', padding: '48px 24px'}}>
				<div style={{color: '#a0aec0', fontSize: '16px'}}>
					No entries for this day
				</div>
				<div
					style={{
						color: '#cbd5e0',
						fontSize: '13px',
						marginTop: '6px'
					}}>
					Select a product and add your first meal above.
				</div>
			</Card>
		);
	}

	return (
		<>
			{MEAL_TIMES.map(meal => {
				const entries = dayEntries.filter(e => e.mealTime === meal.value);
				if (!entries.length) return null;
				return (
					<MealSection 
						key={meal.value}
						label={meal.label}
						entries={entries}
						onDelete={id => deleteLogEntry.mutate(id)}
						onUpdate={(id, amount) => updateLogEntry.mutate({id, data: {amount}})}
					/>
				);
			})}
			<MacroBar {...totals} goals={goals} />
		</>
	);
}
