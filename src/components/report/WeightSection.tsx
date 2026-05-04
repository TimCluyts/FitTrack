import {useWeightEntries} from '../../hooks/useApi';
import {BodyWeightCard} from './BodyWeightCard';

export function WeightSection() {
	const {data: entries = []} = useWeightEntries();

	if (!entries.length) return null;

	return <BodyWeightCard entries={entries} />;
}
