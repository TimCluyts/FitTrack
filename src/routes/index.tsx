import {createFileRoute, redirect, useNavigate} from '@tanstack/react-router';
import {useUserStore, USERS} from '../store/userStore';
import {UserPicker} from '../components/UserPicker';
import type {UserId} from '../store/userStore';

export const Route = createFileRoute('/')({
	beforeLoad: () => {
		try {
			const stored = localStorage.getItem('user-prefs');
			const userId = stored
				? JSON.parse(stored)?.state?.activeUserId
				: null;
			if (userId && USERS.some(u => u.id === userId)) {
				throw redirect({to: '/log'});
			}
		} catch (e) {
			if (e instanceof Response || (e as {_isRedirect?: boolean})._isRedirect) throw e;
		}
	},
	component: IndexPage
});

function IndexPage() {
	const navigate = useNavigate();
	const {setActiveUser} = useUserStore();

	const handleSelect = async (id: UserId) => {
		await setActiveUser(id);
		navigate({to: '/log'});
	};

	return <UserPicker onSelect={handleSelect} />;
}
