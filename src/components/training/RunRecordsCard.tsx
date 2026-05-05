import {formatPace} from '../../utils/pace';
import {Card} from '../ui/Card';

const STAT_LABEL = {
	fontSize: '11px',
	color: '#718096',
	textTransform: 'uppercase' as const,
	letterSpacing: '0.05em'
};

function RecordStat({value, label}: {value: string; label: string}) {
	return (
		<div>
			<div style={{fontSize: '20px', fontWeight: 700, color: '#1b4332'}}>
				{value}
			</div>
			<div style={STAT_LABEL}>{label}</div>
		</div>
	);
}

interface RunRecordsCardProps {
	prDistance: number | null;
	prSpeed: number | null;
	prPaceVal: number | null;
}

export function RunRecordsCard({prDistance, prSpeed, prPaceVal}: RunRecordsCardProps) {
	return (
		<Card>
			<div
				style={{
					fontWeight: 600,
					fontSize: '13px',
					color: '#1b4332',
					textTransform: 'uppercase',
					letterSpacing: '0.04em',
					marginBottom: '10px'
				}}>
				🏆 Run Records
			</div>
			<div style={{display: 'flex', flexWrap: 'wrap', gap: '16px'}}>
				{prDistance != null && (
					<RecordStat value={`${prDistance} km`} label="Longest run" />
				)}
				{prSpeed != null && (
					<RecordStat value={`${prSpeed} km/h`} label="Fastest speed" />
				)}
				{prPaceVal != null && (
					<RecordStat value={formatPace(prPaceVal)} label="Best pace" />
				)}
			</div>
		</Card>
	);
}
