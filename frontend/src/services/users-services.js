import axios from 'axios';
import toast from 'solid-toast';

export const getUserJobTitle = async (uid) => {
	let response;
	try {
		response = awaitaxios.get(`${import.meta.env.VITE_BACKEND_URL}/users/gjt/${uid}`);
	} catch (err) {
		toast.error("Erreur lors de l'obtention du titre de l'utilisateur");
	}
	return response.data.job_title;
};
