import {useNavigate} from '@tanstack/react-router';
import {useUserStore} from '../../store/userStore';
import {useUsers} from '../../hooks/useApi';

interface UserBadgeProps {
	compact?: boolean;
}

export function UserBadge({compact}: UserBadgeProps) {
	const navigate = useNavigate();
	const {activeUserId, clearActiveUser} = useUserStore();
	const {data: users = []} = useUsers();

	if (!activeUserId) return null;

	const name = users.find(u => u.id === activeUserId)?.name ?? '?';

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
