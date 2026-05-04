import {createFileRoute} from '@tanstack/react-router';
import {useHasReportData} from '../hooks/useHasReportData';
import {PageHeader} from '../components/ui/PageHeader';
import {EmptyReportCard} from '../components/report/EmptyReportCard';
import {NutritionSection} from '../components/report/NutritionSection';
import {WeightSection} from '../components/report/WeightSection';
import {TrainingSection} from '../components/report/TrainingSection';
import {RunningSection} from '../components/report/RunningSection';

export const Route = createFileRoute('/report')({
	component: ReportPage
});

function ReportPage() {
	const hasData = useHasReportData();

	if (!hasData) return <EmptyReportCard />;

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
			<PageHeader title="Report" />
			<NutritionSection />
			<WeightSection />
			<TrainingSection />
			<RunningSection />
		</div>
	);
}
