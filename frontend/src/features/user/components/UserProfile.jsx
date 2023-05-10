import { Show, createEffect, createResource, createSignal } from 'solid-js';
import TitleCard from '../../../components/Cards/TitleCard';
import CreateNewUserForm from './CreateNewUserForm';
import { setUserGeneralInfo } from '../../../data/mainStoreFunctions';
import toast from 'solid-toast';
import { appStore } from '../../../data/mainStore';
import axios from 'axios';
import SuspenseContent from '../../../containers/SuspenseContent';

const fetchUserInfo = async () => {
	if (localStorage.getItem('token') || appStore.userLoginInfo.token) {
		let response;
		try {
			response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/info/${localStorage.getItem('userId')}`);
		} catch (err) {
			toast.error("Erreur lors de l'obtention des informations de l'utilisateur");
		}

		return response;
	}
};

const [fetcherSignal, setFetcherSignal] = createSignal(1);
export const [userRessource, { mutate, refetch }] = createResource(fetcherSignal(), fetchUserInfo);

const User = () => {
	// setUserGeneralInfo
	createEffect(() => {
		if (userRessource.error) {
			if (!isUserLoggedIn()) {
				toast.error('Oops! il semble que votre session a expiré. Reconnectez-vous.');
				setTimeout(() => {
					return navigate('/login', { replace: true });
				}, 3000);
			}
		}
		if (!userRessource.loading) {
			setUserGeneralInfo(userRessource().data.user);
		}
	});

	return (
		<>
			<Show
				when={!userRessource.loading}
				fallback={<SuspenseContent />}
			>
				<TitleCard
					title={'Liste des bénéficiaires'}
					topMargin='mt-1'
				>
					<CreateNewUserForm fromUserProile={true} />
				</TitleCard>
			</Show>
		</>
	);
};

export default User;
