interface PrBadgeProps {
	label?: string;
	title?: string;
}

export function PrBadge({label = '🏆 PR', title}: PrBadgeProps) {
	return (
		<span
			title={title}
			style={{
				fontSize: '11px',
				background: '#fffbeb',
				color: '#92400e',
				border: '1px solid #fde68a',
				borderRadius: '4px',
				fontWeight: 700,
				padding: '1px 6px'
			}}>
			{label}
		</span>
	);
}
