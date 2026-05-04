import {createFileRoute, redirect} from '@tanstack/react-router';
import {UserPicker} from '../components/UserPicker';

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
	return <UserPicker />;
}
