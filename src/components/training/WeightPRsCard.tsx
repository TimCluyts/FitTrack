import {Card} from '../ui/Card';

interface PR {
	name: string;
	weight: number;
}

interface WeightPRsCardProps {
	prs: PR[];
}

export function WeightPRsCard({prs}: WeightPRsCardProps) {
	return (
		<Card>
			<div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
				{prs.map(pr => (
					<span
						key={pr.name}
						style={{
							fontSize: '13px',
							background: '#fffbeb',
							color: '#92400e',
							border: '1px solid #fde68a',
							borderRadius: '4px',
							padding: '4px 10px',
							fontWeight: 500
						}}>
						🏆 {pr.name}: {pr.weight} kg
					</span>
				))}
			</div>
		</Card>
	);
}
