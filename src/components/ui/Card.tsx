import type {HTMLAttributes} from 'react';

export function Card({
	style,
	children,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			{...props}
			style={{
				background: 'white',
				borderRadius: '8px',
				padding: '20px',
				boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
				...style
			}}>
			{children}
		</div>
	);
}
