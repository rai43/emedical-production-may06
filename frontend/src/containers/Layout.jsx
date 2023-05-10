import { lazy, onMount } from 'solid-js';
import toast, { Toaster } from 'solid-toast';

const RightSidebar = lazy(() => import('./RightSidebar'));
const LeftSidebar = lazy(() => import('./LeftSidebar'));
const ModalLayout = lazy(() => import('./ModalLayout'));
const PageContent = lazy(() => import('./PageContent'));

import { modalState } from '../data/modalState';
import { isTokenValid } from '../components/helpers/AuthenticationService';

const Layout = () => {
	onMount(() => {
		if (!isTokenValid()) {
			toast.error('Oops! il semble que votre session a expiré. Reconnectez-vous.');
			setTimeout(() => {
				return navigate('/login', { replace: true });
			}, 2000);
		}
	});

	return (
		<>
			{/* Left drawer - containing page content and side bar (always open) */}
			<div class='drawer drawer-mobile'>
				<input
					id='left-sidebar-drawer'
					type='checkbox'
					class='drawer-toggle'
				/>
				<PageContent />
				<LeftSidebar />
			</div>

			{/* Right drawer - containing secondary content like notifications list etc.. */}
			<RightSidebar />

			{/** Notification layout container */}
			{/* <NotificationContainer /> */}

			{/* Modal layout container */}
			<Show when={modalState.isOpen}>
				<ModalLayout />
			</Show>
			<Toaster />
		</>
	);
};

export default Layout;
