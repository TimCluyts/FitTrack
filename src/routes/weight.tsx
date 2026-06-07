import {createFileRoute} from '@tanstack/react-router';
import {PageHeader} from '../components/ui/PageHeader';
import {WeightLogForm} from '../components/weight/WeightLogForm';
import {WeightChart} from '../components/weight/WeightChart';
import {WeightHistoryTable} from '../components/weight/WeightHistoryTable';
import {MeasurementsLogForm} from '../components/weight/MeasurementsLogForm';
import {MeasurementsChart} from '../components/weight/MeasurementsChart';
import {MeasurementsHistoryTable} from '../components/weight/MeasurementsHistoryTable';

export const Route = createFileRoute('/weight')({
	component: WeightPage
});

function WeightPage() {
	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
			<PageHeader title="Weight & Measurements" />
			<WeightLogForm />
			<WeightChart />
			<WeightHistoryTable />
			<MeasurementsLogForm />
			<MeasurementsChart />
			<MeasurementsHistoryTable />
		</div>
	);
}
