import {createFileRoute, redirect, useNavigate} from '@tanstack/react-router';
import {useUserStore} from '../store/userStore';
import {useUsers} from '../hooks/useApi';

export const Route = createFileRoute('/')({
	beforeLoad: () => {
		try {
			const stored = localStorage.getItem('user-prefs');
			const userId = stored ? JSON.parse(stored)?.state?.activeUserId : null;
			if (userId) throw redirect({to: '/log'});
		} catch (e) {
			if (e instanceof Response || (e as {_isRedirect?: boolean})._isRedirect) throw e;
		}
	},
	component: IndexPage
});

function IndexPage() {
	const navigate = useNavigate();
	const {setActiveUserId} = useUserStore();
	const {data: users = [], isLoading} = useUsers();

	const handleSelect = (id: string) => {
		setActiveUserId(id);
		navigate({to: '/log'});
	};

	if (isLoading)
		return (
			<div style={{textAlign: 'center', padding: '60px', color: '#718096'}}>
				Loading…
			</div>
		);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '60vh',
				gap: '24px'
			}}>
			<div style={{fontSize: '22px', fontWeight: 700, color: '#1b4332'}}>
				Who's logging today?
			</div>
			<div
				style={{
					display: 'flex',
					gap: '16px',
					flexWrap: 'wrap',
					justifyContent: 'center'
				}}>
				{users.map(u => (
					<button
						key={u.id}
						onClick={() => handleSelect(u.id)}
						style={{
							width: '100px',
							height: '100px',
							borderRadius: '50%',
							background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
							border: 'none',
							cursor: 'pointer',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'white',
							gap: '6px',
							fontSize: '14px',
							fontWeight: 600
						}}>
						<span style={{fontSize: '28px', fontWeight: 700}}>{u.name[0]}</span>
						{u.name}
					</button>
				))}
			</div>
		</div>
	);
}
