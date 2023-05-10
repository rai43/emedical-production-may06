import { createEffect, lazy } from 'solid-js';
import toast from 'solid-toast';
import { useNavigate } from '@solidjs/router';

const AddBulkMedication = lazy(() => import('../../features/medications/components/AddBulkMedication'));
const Protected = lazy(() => import('../../components/helpers/Protected'));

import { setPageTitle } from '../../data/mainStoreFunctions';
import { isUserLoggedIn } from '../../components/helpers/AuthenticationService';

function InternalPage() {
	const navigate = useNavigate();
	createEffect(() => {
		setPageTitle('Bulk Ajout de médicaments');
		if (!isUserLoggedIn()) {
			toast.error('Oops! il semble que votre session a expiré. Reconnectez-vous.');
			setTimeout(() => {
				return navigate('/login', { replace: true });
			}, 3000);
		}
	});

	return (
		<Protected>
			<AddBulkMedication />
		</Protected>
	);
}

export default InternalPage;
