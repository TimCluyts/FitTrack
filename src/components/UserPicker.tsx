import type {User} from '../store/userStore';

export function UserPicker({users, onSelect}: {users: User[]; onSelect: (id: string) => void}) {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: '32px',
				padding: '64px 24px'
			}}>
			<div>
				<div
					style={{
						fontSize: '24px',
						fontWeight: 700,
						color: '#1b4332',
						textAlign: 'center',
						marginBottom: '6px'
					}}>
					Who's logging today?
				</div>
				<div
					style={{
						fontSize: '14px',
						color: '#718096',
						textAlign: 'center'
					}}>
					Products and recipes are shared between profiles.
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					gap: '20px',
					flexWrap: 'wrap',
					justifyContent: 'center'
				}}>
				{users.map(user => (
					<button
						key={user.id}
						onClick={() => onSelect(user.id)}
						style={{
							background: 'white',
							border: '2px solid #e8f0e9',
							borderRadius: '12px',
							padding: '32px 48px',
							cursor: 'pointer',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: '12px',
							transition: 'border-color 0.15s, box-shadow 0.15s',
							boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
						}}
						onMouseEnter={e => {
							(e.currentTarget as HTMLButtonElement).style.borderColor =
								'#2d6a4f';
							(e.currentTarget as HTMLButtonElement).style.boxShadow =
								'0 4px 12px rgba(45,106,79,0.15)';
						}}
						onMouseLeave={e => {
							(e.currentTarget as HTMLButtonElement).style.borderColor =
								'#e8f0e9';
							(e.currentTarget as HTMLButtonElement).style.boxShadow =
								'0 1px 3px rgba(0,0,0,0.06)';
						}}>
						<div
							style={{
								width: '64px',
								height: '64px',
								borderRadius: '50%',
								background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'white',
								fontSize: '28px',
								fontWeight: 700
							}}>
							{user.name[0]}
						</div>
						<div
							style={{
								fontSize: '18px',
								fontWeight: 600,
								color: '#1b4332'
							}}>
							{user.name}
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
