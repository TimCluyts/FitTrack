import {useNutritionChartData} from '../../hooks/useNutritionChartData';
import {NutritionSummaryCard} from './NutritionSummaryCard';

export function NutritionSummarySection() {
	const {allDays} = useNutritionChartData();

	if (!allDays.length) return null;

	return <NutritionSummaryCard days={allDays} />;
}
