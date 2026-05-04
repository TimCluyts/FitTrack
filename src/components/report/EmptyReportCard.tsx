import {Card} from '../ui/Card';

export function EmptyReportCard() {
	return (
		<Card style={{textAlign: 'center', padding: '60px 24px'}}>
			<div style={{color: '#a0aec0', fontSize: '16px'}}>No data yet</div>
			<div style={{color: '#cbd5e0', fontSize: '13px', marginTop: '6px'}}>
				Start logging to see your report here.
			</div>
		</Card>
	);
}
