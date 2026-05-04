import {useNutritionChartData} from '../../hooks/useNutritionChartData';
import {CaloriesPerDayCard} from './CaloriesPerDayCard';
import {MacrosPerDayCard} from './MacrosPerDayCard';
import {NutritionSummaryCard} from './NutritionSummaryCard';

export function NutritionSection() {
	const {allDays, chartDays} = useNutritionChartData();

	if (!allDays.length) return null;

	return (
		<>
			<CaloriesPerDayCard data={chartDays} />
			<MacrosPerDayCard data={chartDays} />
			<NutritionSummaryCard days={allDays} />
		</>
	);
}
