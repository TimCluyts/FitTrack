import {useNutritionChartData} from '../../hooks/useNutritionChartData';
import {CaloriesPerDayCard} from './CaloriesPerDayCard';
import {MacrosPerDayCard} from './MacrosPerDayCard';

export function NutritionSection() {
	const {chartDays} = useNutritionChartData();

	if (!chartDays.length) return null;

	return (
		<>
			<CaloriesPerDayCard data={chartDays} />
			<MacrosPerDayCard data={chartDays} />
		</>
	);
}
