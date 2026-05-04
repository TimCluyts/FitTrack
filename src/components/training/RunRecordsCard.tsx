import {formatPace} from '../../utils/pace';
import {Card} from '../ui/Card';

const STAT_LABEL = {
	fontSize: '11px',
	color: '#718096',
	textTransform: 'uppercase' as const,
	letterSpacing: '0.05em'
};

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
					<div>
						<div
							style={{fontSize: '20px', fontWeight: 700, color: '#1b4332'}}>
							{prDistance} km
						</div>
						<div style={STAT_LABEL}>Longest run</div>
					</div>
				)}
				{prSpeed != null && (
					<div>
						<div
							style={{fontSize: '20px', fontWeight: 700, color: '#1b4332'}}>
							{prSpeed} km/h
						</div>
						<div style={STAT_LABEL}>Fastest speed</div>
					</div>
				)}
				{prPaceVal != null && (
					<div>
						<div
							style={{fontSize: '20px', fontWeight: 700, color: '#1b4332'}}>
							{formatPace(prPaceVal)}
						</div>
						<div style={STAT_LABEL}>Best pace</div>
					</div>
				)}
			</div>
		</Card>
	);
}
