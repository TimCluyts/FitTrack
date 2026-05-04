import {formatPace} from '../../utils/pace';
import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import type {RunLog} from '../../types/fitness';

const PR_BADGE = {
	fontSize: '11px',
	background: '#fffbeb',
	color: '#92400e',
	border: '1px solid #fde68a',
	borderRadius: '4px',
	fontWeight: 700
} as const;

interface RunLogCardProps {
	log: RunLog;
	onDelete: () => void;
	prDistance: number | null;
	prSpeed: number | null;
	prPaceVal: number | null;
}

export function RunLogCard({log, onDelete, prDistance, prSpeed, prPaceVal}: RunLogCardProps) {
	const pace =
		log.durationMin != null && log.distanceKm > 0
			? log.durationMin / log.distanceKm
			: null;
	const isPRDist = log.distanceKm === prDistance;
	const isPRSpeed = log.speedKmh != null && log.speedKmh === prSpeed;
	const isPRPace = pace != null && prPaceVal != null && Math.abs(pace - prPaceVal) < 0.001;

	return (
		<Card>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					gap: '10px',
					flexWrap: 'wrap'
				}}>
				<div>
					<div
						style={{
							fontWeight: 600,
							fontSize: '15px',
							color: '#1b4332',
							marginBottom: '2px',
							display: 'flex',
							alignItems: 'center',
							gap: '6px'
						}}>
						{log.distanceKm} km
						{isPRDist && (
							<span
								title="Personal record distance"
								style={{...PR_BADGE, padding: '1px 6px'}}>
								🏆 PR afstand
							</span>
						)}
					</div>
					<div
						style={{
							fontSize: '13px',
							color: '#718096',
							display: 'flex',
							flexWrap: 'wrap',
							gap: '6px',
							alignItems: 'center'
						}}>
						<span>{log.date}</span>
						{log.durationMin != null && (
							<span>· {log.durationMin} min</span>
						)}
						{log.speedKmh != null && (
							<span
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '4px'
								}}>
								· {log.speedKmh} km/h
								{isPRSpeed && (
									<span
										title="Personal record speed"
										style={{...PR_BADGE, padding: '1px 5px'}}>
										🏆 PR
									</span>
								)}
							</span>
						)}
						{pace != null && (
							<span
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '4px'
								}}>
								· {formatPace(pace)}
								{isPRPace && (
									<span
										title="Personal record pace"
										style={{...PR_BADGE, padding: '1px 5px'}}>
										🏆 PR
									</span>
								)}
							</span>
						)}
						{log.kcal != null && <span>· {log.kcal} kcal</span>}
						{log.note && <span>· {log.note}</span>}
					</div>
				</div>
				<Button
					variant="ghost-danger"
					size="sm"
					onClick={onDelete}
					style={{fontSize: '16px', padding: '2px 6px', lineHeight: 1}}
					title="Delete">
					×
				</Button>
			</div>
		</Card>
	);
}
