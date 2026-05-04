import {Link, useMatchRoute} from '@tanstack/react-router';

interface NavLinkProps {
	to: string;
	children: string;
	onClick?: () => void;
}

export function NavLink({to, children, onClick}: NavLinkProps) {
	const matchRoute = useMatchRoute();
	const isActive = !!matchRoute({to});

	return (
		<Link
			to={to}
			onClick={onClick}
			style={{
				color: 'white',
				textDecoration: 'none',
				padding: '8px 18px',
				borderRadius: '6px',
				fontWeight: isActive ? 600 : 400,
				backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
				fontSize: '14px',
				transition: 'background 0.15s'
			}}>
			{children}
		</Link>
	);
}

interface MobileNavLinkProps {
	to: string;
	children: string;
	onClick: () => void;
}

export function MobileNavLink({to, children, onClick}: MobileNavLinkProps) {
	const matchRoute = useMatchRoute();
	const isActive = !!matchRoute({to});

	return (
		<Link
			to={to}
			onClick={onClick}
			style={{
				color: 'white',
				textDecoration: 'none',
				padding: '12px 16px',
				borderRadius: '6px',
				fontWeight: isActive ? 600 : 400,
				backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
				fontSize: '15px',
				display: 'block',
				transition: 'background 0.15s'
			}}>
			{children}
		</Link>
	);
}
