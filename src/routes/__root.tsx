import {createRootRoute, Link, Outlet} from '@tanstack/react-router';
import {useState} from 'react';
import {useUserStore} from '../store/userStore';
import {useIsMobile} from '../hooks/useIsMobile';
import {NavLink, MobileNavLink} from '../components/layout/NavLink';
import {UserBadge} from '../components/layout/UserBadge';

export const Route = createRootRoute({
	component: RootLayout
});

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
								<NavLink to="/grocery">Grocery</NavLink>
								<UserBadge />
							</div>
						)}
					</div>

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
									<MobileNavLink to="/training" onClick={closeMenu}>
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
							<MobileNavLink to="/grocery" onClick={closeMenu}>
								Grocery
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
