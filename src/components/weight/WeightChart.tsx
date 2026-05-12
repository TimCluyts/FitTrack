import {useWeightEntries} from '../../hooks/useApi';
import {BodyWeightCard} from '../report/BodyWeightCard';

export function WeightChart() {
	const {data: entries = []} = useWeightEntries();

	if (!entries.length) return null;

	return <BodyWeightCard entries={entries} />;
}
