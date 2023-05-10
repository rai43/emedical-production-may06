import { createEffect, lazy } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import toast from 'solid-toast';

const Protected = lazy(() => import('../../components/helpers/Protected'));
const Beneficiary = lazy(() => import('../../features/beneficiary'));

import { setPageTitle } from '../../data/mainStoreFunctions';
import { isUserLoggedIn } from '../../components/helpers/AuthenticationService';

function InternalPage() {
	const navigate = useNavigate();
	createEffect(() => {
		setPageTitle('Bénéficiaire');
		if (!isUserLoggedIn()) {
			toast.error('Oops! il semble que votre session a expiré. Reconnectez-vous.');
			setTimeout(() => {
				return navigate('/login', { replace: true });
			}, 3000);
		}
	});

	return (
		<Protected>
			<Beneficiary />
		</Protected>
	);
}

export default InternalPage;
