import {useState} from 'react';
import {formatDate, friendlyDate} from '../utils/formatting';

export function useDateNavigation() {
	const today = formatDate(new Date());
	const [date, setDate] = useState(today);

	const navigate = (delta: number) => {
		const d = new Date(date + 'T00:00:00');
		d.setDate(d.getDate() + delta);
		setDate(formatDate(d));
	};

	return {
		date,
		setDate,
		today,
		isToday: date === today,
		navigatePrev: () => navigate(-1),
		navigateNext: () => navigate(1),
		label: friendlyDate(date, today)
	};
}
