import {createFileRoute} from '@tanstack/react-router';
import {useNutritionStore} from '../store/nutritionStore';
import {getEntryMacros, sumMacros} from '../utils/macros';
import {useDateNavigation} from '../hooks/useDateNavigation';
import {DateNavBar} from '../components/log/DateNavBar';
import {AddEntryCard} from '../components/log/AddEntryCard';
import {MealSection} from '../components/log/MealSection';
import {MacroBar} from '../components/MacroBar';
import {Card} from '../components/ui/Card';
import {MEAL_TIMES, type MacroTotals} from '../types/fitness';

export const Route = createFileRoute('/log')({
	component: LogPage
});

function LogPage() {
	const {date, setDate, today, isToday, navigatePrev, navigateNext, label} =
		useDateNavigation();
	const {products, recipes, logEntries, deleteLogEntry} = useNutritionStore();

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
						onDelete={deleteLogEntry}
					/>
				);
			})}

			{dayEntries.length > 0 ? (
				<MacroBar {...totals} />
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
