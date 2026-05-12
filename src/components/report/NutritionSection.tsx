import {useNutritionChartData} from '../../hooks/useNutritionChartData';
import {useGoals} from '../../hooks/useApi';
import {CaloriesPerDayCard} from './CaloriesPerDayCard';
import {MacrosPerDayCard} from './MacrosPerDayCard';

export function NutritionSection() {
	const {chartDays} = useNutritionChartData();
	const {data: goals} = useGoals();

	if (!chartDays.length) return null;

	return (
		<>
			<CaloriesPerDayCard data={chartDays} goals={goals} />
			<MacrosPerDayCard data={chartDays} goals={goals} />
		</>
	);
}
