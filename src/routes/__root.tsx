import {
	createRootRoute,
	Link,
	Outlet,
	useMatchRoute,
	useNavigate
} from '@tanstack/react-router';
import {useState} from 'react';
import {useUserStore, USERS} from '../store/userStore';
import {useIsMobile} from '../hooks/useIsMobile';

export const Route = createRootRoute({
	component: RootLayout
});

function NavLink({
	to,
	children,
	onClick
}: {
	to: string;
	children: string;
	onClick?: () => void;
}) {
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

function MobileNavLink({
	to,
	children,
	onClick
}: {
	to: string;
	children: string;
	onClick: () => void;
}) {
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
				backgroundColor: isActive
					? 'rgba(255,255,255,0.2)'
					: 'transparent',
				fontSize: '15px',
				display: 'block',
				transition: 'background 0.15s'
			}}>
			{children}
		</Link>
	);
}

function UserBadge({compact}: {compact?: boolean}) {
	const navigate = useNavigate();
	const {activeUserId, clearActiveUser} = useUserStore();
	if (!activeUserId) return null;

	const name = USERS.find(u => u.id === activeUserId)?.name ?? activeUserId;

	const handleSwitch = () => {
		clearActiveUser();
		navigate({to: '/'});
	};

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: '8px',
				marginLeft: compact ? '0' : '12px',
				paddingLeft: compact ? '0' : '12px',
				borderLeft: compact ? 'none' : '1px solid rgba(255,255,255,0.25)'
			}}>
			<div
				style={{
					width: '28px',
					height: '28px',
					borderRadius: '50%',
					background: 'rgba(255,255,255,0.25)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: 'white',
					fontSize: '13px',
					fontWeight: 700,
					flexShrink: 0
				}}>
				{name[0]}
			</div>
			{!compact && (
				<span style={{color: 'white', fontSize: '14px', fontWeight: 500}}>
					{name}
				</span>
			)}
			<button
				onClick={handleSwitch}
				style={{
					background: 'rgba(255,255,255,0.15)',
					border: 'none',
					borderRadius: '4px',
					color: 'rgba(255,255,255,0.8)',
					fontSize: '12px',
					padding: '3px 8px',
					cursor: 'pointer',
					whiteSpace: 'nowrap'
				}}>
				switch
			</button>
		</div>
	);
}

function RootLayout() {
	const {activeUserId} = useUserStore();
	const isMobile = useIsMobile();
	const [menuOpen, setMenuOpen] = useState(false);
	const closeMenu = () => setMenuOpen(false);

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
					boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
				}}>
				<div
					style={{
						maxWidth: '1100px',
						margin: '0 auto',
						padding: '0 16px'
					}}>
					{/* Header row — always visible */}
					<div
						style={{
							height: '52px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between'
						}}>
						<Link
							to="/"
							style={{
								color: 'white',
								fontWeight: 700,
								fontSize: '17px',
								letterSpacing: '-0.2px',
								textDecoration: 'none'
							}}>
							FitTrack
						</Link>

						{isMobile ? (
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '8px'
								}}>
								<UserBadge compact />
								<button
									onClick={() => setMenuOpen(o => !o)}
									aria-label="Toggle menu"
									style={{
										background: menuOpen
											? 'rgba(255,255,255,0.2)'
											: 'rgba(255,255,255,0.1)',
										border: 'none',
										borderRadius: '6px',
										color: 'white',
										fontSize: '20px',
										width: '36px',
										height: '36px',
										cursor: 'pointer',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										lineHeight: 1
									}}>
									{menuOpen ? '✕' : '☰'}
								</button>
							</div>
						) : (
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '4px'
								}}>
								{activeUserId && (
									<>
										<NavLink to="/log">Log</NavLink>
										<NavLink to="/weight">Weight</NavLink>
										<NavLink to="/training">Training</NavLink>
										<NavLink to="/report">Report</NavLink>
									</>
								)}
								<NavLink to="/products">Products</NavLink>
								<NavLink to="/recipes">Recipes</NavLink>
								<UserBadge />
							</div>
						)}
					</div>

					{/* Mobile dropdown */}
					{isMobile && menuOpen && (
						<div
							style={{
								paddingBottom: '12px',
								borderTop: '1px solid rgba(255,255,255,0.15)'
							}}>
							{activeUserId && (
								<>
									<MobileNavLink to="/log" onClick={closeMenu}>
										Log
									</MobileNavLink>
									<MobileNavLink to="/weight" onClick={closeMenu}>
										Weight
									</MobileNavLink>
									<MobileNavLink
										to="/training"
										onClick={closeMenu}>
										Training
									</MobileNavLink>
									<MobileNavLink to="/report" onClick={closeMenu}>
										Report
									</MobileNavLink>
								</>
							)}
							<MobileNavLink to="/products" onClick={closeMenu}>
								Products
							</MobileNavLink>
							<MobileNavLink to="/recipes" onClick={closeMenu}>
								Recipes
							</MobileNavLink>
						</div>
					)}
				</div>
			</nav>
			<main
				style={{
					maxWidth: '1100px',
					margin: '0 auto',
					padding: isMobile ? '16px 12px' : '24px 16px'
				}}>
				<Outlet />
			</main>
		</div>
	);
}
