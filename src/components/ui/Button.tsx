import type {ButtonHTMLAttributes} from 'react';

type Variant = 'primary' | 'outline' | 'secondary' | 'ghost-danger';

const variants: Record<Variant, React.CSSProperties> = {
	primary: {background: '#2d6a4f', color: 'white', border: 'none'},
	outline: {
		background: 'transparent',
		color: '#2d6a4f',
		border: '1px solid #b7d9c5'
	},
	secondary: {background: '#e8f4ee', color: '#2d6a4f', border: 'none'},
	'ghost-danger': {background: 'none', color: '#c53030', border: 'none'}
};

const sizes: Record<'sm' | 'md', React.CSSProperties> = {
	sm: {padding: '6px 12px', fontSize: '13px'},
	md: {padding: '9px 18px', fontSize: '14px'}
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: Variant;
	size?: 'sm' | 'md';
}

export function Button({
	variant = 'primary',
	size = 'md',
	disabled,
	style,
	...props
}: ButtonProps) {
	return (
		<button
			{...props}
			disabled={disabled}
			style={{
				borderRadius: '6px',
				fontWeight: 500,
				fontFamily: 'inherit',
				cursor: disabled ? 'not-allowed' : 'pointer',
				opacity: disabled ? 0.5 : 1,
				...variants[variant],
				...sizes[size],
				...style
			}}
		/>
	);
}
