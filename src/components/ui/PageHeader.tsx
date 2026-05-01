import type {ReactNode} from 'react';

interface PageHeaderProps {
	title: string;
	children?: ReactNode;
}

export function PageHeader({title, children}: PageHeaderProps) {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				flexWrap: 'wrap',
				gap: '10px'
			}}>
			<h1
				style={{
					margin: 0,
					fontSize: '22px',
					fontWeight: 700,
					color: '#1b4332'
				}}>
				{title}
			</h1>
			{children && (
				<div
					style={{
						display: 'flex',
						gap: '8px',
						flexWrap: 'wrap',
						alignItems: 'center'
					}}>
					{children}
				</div>
			)}
		</div>
	);
}
