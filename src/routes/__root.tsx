import {
	createRootRoute,
	Link,
	Outlet,
	useMatchRoute
} from '@tanstack/react-router';

export const Route = createRootRoute({
	component: RootLayout
});

function NavLink({to, children}: {to: string; children: string}) {
	const matchRoute = useMatchRoute();
	const isActive = !!matchRoute({to});
	return (
		<Link
			to={to}
			style={{
				color: 'white',
				textDecoration: 'none',
				padding: '8px 18px',
				borderRadius: '6px',
				fontWeight: isActive ? 600 : 400,
				backgroundColor: isActive
					? 'rgba(255,255,255,0.2)'
					: 'transparent',
				fontSize: '14px',
				transition: 'background 0.15s'
			}}>
			{children}
		</Link>
	);
}

function RootLayout() {
	return (
		<div
			style={{
				minHeight: '100vh',
				backgroundColor: '#f5f6f8',
				fontFamily: 'system-ui, -apple-system, sans-serif'
			}}>
			<nav
				style={{
					background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
					padding: '0 24px',
					boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
				}}>
				<div
					style={{
						maxWidth: '1100px',
						margin: '0 auto',
						height: '52px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between'
					}}>
					<span
						style={{
							color: 'white',
							fontWeight: 700,
							fontSize: '17px',
							letterSpacing: '-0.2px'
						}}>
						FitTrack
					</span>
					<div style={{display: 'flex', gap: '4px'}}>
						<NavLink to="/log">Log</NavLink>
						<NavLink to="/products">Products</NavLink>
						<NavLink to="/recipes">Recipes</NavLink>
						<NavLink to="/weight">Weight</NavLink>
						<NavLink to="/training">Training</NavLink>
						<NavLink to="/report">Report</NavLink>
					</div>
				</div>
			</nav>
			<main
				style={{
					maxWidth: '1100px',
					margin: '0 auto',
					padding: '24px 16px'
				}}>
				<Outlet />
			</main>
		</div>
	);
}
