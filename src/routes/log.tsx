import {createFileRoute} from '@tanstack/react-router';
import {useDateNavigation} from '../hooks/useDateNavigation';
import {DateNavBar} from '../components/log/DateNavBar';
import {AddEntryCard} from '../components/log/AddEntryCard';
import {FavoritesBar} from '../components/log/FavoritesBar';
import {GoalsCard} from '../components/log/GoalsCard';
import {DayMealsSection} from '../components/log/DayMealsSection';

export const Route = createFileRoute('/log')({
	component: LogPage
});

function LogPage() {
	const {date, setDate, today, isToday, navigatePrev, navigateNext, label} =
		useDateNavigation();

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
			<FavoritesBar date={date} />
			<GoalsCard />
			<DayMealsSection date={date} />
		</div>
	);
}
