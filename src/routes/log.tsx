import {createFileRoute} from '@tanstack/react-router';
import {useProducts, useRecipes, useLogEntries, useDeleteLogEntry} from '../hooks/useApi';
import {getEntryMacros, sumMacros} from '../utils/macros';
import {useDateNavigation} from '../hooks/useDateNavigation';
import {DateNavBar} from '../components/log/DateNavBar';
import {AddEntryCard} from '../components/log/AddEntryCard';
import {MealSection} from '../components/log/MealSection';
import {GoalsCard} from '../components/log/GoalsCard';
import {MacroBar} from '../components/MacroBar';
import {Card} from '../components/ui/Card';
import {MEAL_TIMES, type MacroTotals} from '../types/fitness';
import {useGoalsStore} from '../store/goalsStore';
import {useUserStore} from '../store/userStore';

export const Route = createFileRoute('/log')({
	component: LogPage
});

function LogPage() {
	const {date, setDate, today, isToday, navigatePrev, navigateNext, label} =
		useDateNavigation();
	const {data: products = []} = useProducts();
	const {data: recipes = []} = useRecipes();
	const {data: logEntries = []} = useLogEntries();
	const deleteLogEntry = useDeleteLogEntry();
	const activeUserId = useUserStore(s => s.activeUserId);
	const {goals, setGoals} = useGoalsStore();
	const userGoals = activeUserId ? goals[activeUserId] : undefined;

	const dayEntries = logEntries.filter(e => e.date === date);
	const totals = sumMacros(
		dayEntries
			.map(e => getEntryMacros(e, products, recipes))
			.filter((m): m is MacroTotals => m !== null)
	);

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
			<DateNavBar
				date={date}
				label={label}
				isToday={isToday}
				onPrev={navigatePrev}
				onNext={navigateNext}
				onDateChange={setDate}
				onToday={() => setDate(today)}
			/>

			<AddEntryCard date={date} />

			<GoalsCard
				goals={userGoals}
				onSave={g => activeUserId && setGoals(activeUserId, g)}
			/>

			{MEAL_TIMES.map(meal => {
				const entries = dayEntries.filter(
					e => e.mealTime === meal.value
				);
				if (entries.length === 0) return null;
				return (
					<MealSection
						key={meal.value}
						label={meal.label}
						entries={entries}
						onDelete={(id) => deleteLogEntry.mutate(id)}
					/>
				);
			})}

			{dayEntries.length > 0 ? (
				<MacroBar {...totals} goals={userGoals} />
			) : (
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
			)}
		</div>
	);
}
