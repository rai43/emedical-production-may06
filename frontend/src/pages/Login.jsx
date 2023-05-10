import { lazy } from 'solid-js';
import { Toaster } from 'solid-toast';
const Login = lazy(() => import('../features/user/Login'));

const ExternalPage = () => {
	return (
		<div>
			<Login />
			<Toaster />
		</div>
	);
};

export default ExternalPage;
