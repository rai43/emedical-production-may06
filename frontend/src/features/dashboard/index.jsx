import DashboardStats from './components/DashboardStats';
import AmountStats from './components/AmountStats';
import PageStats from './components/PageStats';
import UserChannels from './components/UserChannels';
import LineChart from './components/LineChart';
import BarChart from './components/BarChart';
import DashboardTopBar from './components/DashboardTopBar';
import DoughnutChart from './components/DoughnutChart';

import { TbLayoutDashboard } from 'solid-icons/tb';
import { Show, createEffect, createResource, createSignal } from 'solid-js';
import axios from 'axios';
import toast from 'solid-toast';
import SuspenseContent from '../../containers/SuspenseContent';

// Consultations
const countWaitingConsultations = async () => {
	let response;
	try {
		if (localStorage.getItem('token') || appStore.userLoginInfo.token) {
			response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/stats/count/consultations/cwc`);
		}
	} catch (err) {
		toast.error("Erreur lors de l'obtention des statistiques");
	}
	return response;
};
const [fetcherSignal, setFetcherSignal] = createSignal(1);
export const [waitingCountRessource, { mutate, refetch }] = createResource(fetcherSignal(), countWaitingConsultations);

// Constants
const countWaitingConstants = async () => {
	let response;
	try {
		if (localStorage.getItem('token') || appStore.userLoginInfo.token) {
			response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/stats/count/constants/cwcst`);
		}
	} catch (err) {
		toast.error("Erreur lors de l'obtention des statistiques");
	}
	return response;
};
const [fetchercstSignal, setFetcherCstSignal] = createSignal(1);
export const [waitingCountCstRessource, { mutateCst, refetchCst }] = createResource(fetchercstSignal(), countWaitingConstants);

// Exams
const countWaitingExams = async () => {
	let response;
	try {
		if (localStorage.getItem('token') || appStore.userLoginInfo.token) {
			response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/stats/count/exams/cwe`);
		}
	} catch (err) {
		toast.error("Erreur lors de l'obtention des statistiques");
	}
	return response;
};
const [fetcherExSignal, setFetcherExSignal] = createSignal(1);
export const [waitingCountExRessource, { mutateEx, refetchEx }] = createResource(fetcherExSignal(), countWaitingExams);

// Internal Prescription
const countWaitingInternalPrescription = async () => {
	let response;
	try {
		if (localStorage.getItem('token') || appStore.userLoginInfo.token) {
			response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/stats/count/inter-presc/cwip`);
		}
	} catch (err) {
		toast.error("Erreur lors de l'obtention des statistiques");
	}
	return response;
};
const [fetcherIPSignal, setFetcherIPSignal] = createSignal(1);
export const [waitingCountIPRessource, { mutateIP, refetchIP }] = createResource(fetcherIPSignal(), countWaitingInternalPrescription);

// Consultations stats data
const getConsultationsStatsData = async () => {
	let response;
	try {
		if (localStorage.getItem('token') || appStore.userLoginInfo.token) {
			response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/stats/count/global/gcfs`);
		}
	} catch (err) {
		toast.error("Erreur lors de l'obtention des statistiques");
	}
	return response;
};
const [fetcherGCFSSignal, setFetcherGCFSSignal] = createSignal(1);
export const [GCFSRessource, { mutateGCFS, refetchGCFS }] = createResource(fetcherGCFSSignal(), getConsultationsStatsData);

function Dashboard() {
	const [renderLineChart, setRenderLineChart] = createSignal(false);
	const [stats, setStats] = createSignal({});
	const [depatmentWiseStats, setDepatmentWiseStats] = createSignal({});
	const [cm, setCm] = createSignal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	const [cw, setCw] = createSignal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	const [statsData, setStatsData] = createSignal([
		{
			title: 'Consultation(s) en attente',
			value: `0`,
			icon: <TbLayoutDashboard class='w-8 h-8' />,
			description: 'au total',
			// description: '↗︎ 2300 (22%)',
		},
		{
			title: 'Examen(s) en attente',
			value: '0',
			icon: <TbLayoutDashboard class='w-8 h-8' />,
			description: 'au total',
		},
		{
			title: 'Ordonnance(s) en attente',
			value: '0',
			icon: <TbLayoutDashboard class='w-8 h-8' />,
			description: 'au total',
		},
		{
			title: 'Constante(s) en attente',
			value: '0',
			icon: <TbLayoutDashboard class='w-8 h-8' />,
			description: 'au total',
		},
	]);

	createEffect(() => {
		if (!GCFSRessource.loading) {
			setStats({
				...GCFSRessource().data,
			});
			for (const d of stats().stats_data_done.map((data) => new Date(data.created_at).getMonth())) {
				setCm((prevVal) => {
					prevVal[d] += 1;
					return [...prevVal];
				});
			}
			for (const d of stats().stats_data_waiting.map((data) => new Date(data.created_at).getMonth())) {
				setCw((prevVal) => {
					prevVal[d] += 1;
					return [...prevVal];
				});
			}

			stats().stats_data_done.map((data) => {
				return setDepatmentWiseStats((prevData) => {
					const key = data?.beneficiary?.direction || 'AUTRES';
					return {
						...prevData,
						[key]: (prevData[key] || 0) + 1,
					};
				});
			});

			setRenderLineChart(true);
		}
		if (!waitingCountRessource.loading) {
			setStatsData((oldVal) => {
				oldVal[0] = {
					...oldVal[0],
					value: waitingCountRessource().data.count,
				};

				return [...oldVal];
			});
		}
		if (!waitingCountCstRessource.loading) {
			setStatsData((oldVal) => {
				oldVal[3] = {
					...oldVal[3],
					value: waitingCountCstRessource().data.count,
				};

				return [...oldVal];
			});
		}
		if (!waitingCountExRessource.loading) {
			setStatsData((oldVal) => {
				oldVal[1] = {
					...oldVal[1],
					value: waitingCountExRessource().data.count,
				};

				return [...oldVal];
			});
		}
		if (!waitingCountIPRessource.loading) {
			setStatsData((oldVal) => {
				oldVal[2] = {
					...oldVal[2],
					value: waitingCountIPRessource().data.count,
				};

				return [...oldVal];
			});
		}
	});
	return (
		<>
			<Show
				when={!waitingCountRessource.loading && !waitingCountCstRessource.loading && !waitingCountExRessource.loading && !waitingCountIPRessource.loading && !GCFSRessource.loading}
				fallback={<SuspenseContent />}
			>
				{/** ---------------------- Select Period Content ------------------------- */}
				<DashboardTopBar />

				{/** ---------------------- Different stats content 1 ------------------------- */}
				<div class='grid lg:grid-cols-4 mt-8 md:grid-cols-2 grid-cols-1 gap-6'>
					{statsData().map((d, k) => {
						return (
							<DashboardStats
								{...d}
								colorIndex={k}
							/>
						);
					})}
				</div>
				{/** ---------------------- Different charts ------------------------- */}
				<div class='grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6'>
					<Show when={renderLineChart()}>
						<LineChart cm={cm()} />
						<BarChart
							cm={cm()}
							cw={cw()}
						/>
					</Show>
				</div>
				{/** ---------------------- Different stats content 2 ------------------------- */}

				<div class='grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6'>
					<AmountStats />
					<PageStats />
				</div>
				{/** ---------------------- User source channels table  ------------------------- */}
				<div class='grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6'>
					<Show when={renderLineChart()}>
						<UserChannels
							data={Object.entries(depatmentWiseStats()).map((arrElt) => {
								return { source: arrElt[0], count: arrElt[1], conversionPercent: ((arrElt[1] / stats().stats_data_done.length) * 100).toFixed(1) };
							})}
						/>
						<DoughnutChart
							labels={Object.keys(depatmentWiseStats())}
							values={Object.values(depatmentWiseStats())}
						/>
					</Show>
				</div>
			</Show>
		</>
	);
}

export default Dashboard;
