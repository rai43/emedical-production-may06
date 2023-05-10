import AgGridSolid from 'ag-grid-solid';
import { Show, createEffect, createResource, createSignal, lazy } from 'solid-js';
import moment from 'moment';
import axios from 'axios';
import toast from 'solid-toast';
import { useNavigate } from '@solidjs/router';

const TitleCard = lazy(() => import('../../../components/Cards/TitleCard'));

import { openBeneficiaryModal } from '../../../data/modalState/beneficiarySlice';
import { setBeneficiariesList } from '../../../data/mainStoreFunctions';
import { isUserLoggedIn } from '../../../components/helpers/AuthenticationService';
import { GLOBAL_CONSTANTS } from '../../../utils/globalConstantUtil';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import SuspenseContent from '../../../containers/SuspenseContent';

const beneficiaryModalConfig = {
	title: 'Ajouter un Bénéficiaire',
	size: 'lg',
	bodyType: GLOBAL_CONSTANTS.MODAL_BODY_TYPES.BENEFICIARY_NEW,
	extraObject: {},
};

const onSelectionChanged = () => {
	const selectedRows = gridOptions.api.getSelectedRows();
};

const cellClass = (_) => {
	// _: here represents the params
	return 'hover:bg-primary hover:text-white hover:cursor-pointer';
};

const TopSideButtons = () => {
	return (
		<div class='inline-block float-right'>
			<button
				class='btn px-6 btn-sm normal-case btn-primary'
				onClick={() => openBeneficiaryModal(beneficiaryModalConfig)}
			>
				Ajouter Bénéficiaire
			</button>
		</div>
	);
};

const fetchBeneficiaries = async () => {
	if (localStorage.getItem('token') || appStore.userLoginInfo.token) {
		let response;
		try {
			response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/beneficiary`);
		} catch (err) {
			toast.error("Erreur lors de l'obtention de la liste des bénéficiaires");
		}
		return response;
	}
};

const [fetcherSignal, setFetcherSignal] = createSignal(1);
export const [beneficiariesRessource, { mutate, refetch }] = createResource(fetcherSignal(), fetchBeneficiaries);

const ManageBeneficiary = (props) => {
	const navigate = useNavigate();

	createEffect(() => {
		if (beneficiariesRessource.error) {
			if (!isUserLoggedIn()) {
				toast.error('Oops! il semble que votre session a expiré. Reconnectez-vous.');
				setTimeout(() => {
					return navigate('/login', { replace: true });
				}, 3000);
			}
		}
		if (!beneficiariesRessource.loading) {
			setBeneficiariesList(beneficiariesRessource().data.beneficiaries);
		}
	});

	const containFilterParams = {
		filterOptions: ['contains', 'notContains'],
		debounceMs: 200,
		maxNumConditions: 1,
	};

	const columnsDefs = [
		{
			field: 'id_number',
			headerName: 'Matricule',
			width: 180,
			pinned: true,
			filterParams: containFilterParams,
			rowSelection: 'single',
			onSelectionChanged: onSelectionChanged,
			cellRenderer: (value) => {
				const cellValue = value.valueFormatted ? value.valueFormatted : value.value;
				return <span class='font-bold'>{cellValue}</span>;
			},
			// onCellClicked: (params) => cellClickedHandler(params.data),
		},
		{
			field: 'family_name',
			headerName: 'Nom',
			width: 180,
			filter: 'agDateColumnFilter',
		},
		{
			field: 'first_name',
			headerName: 'Prénom(s)',
			width: 180,
			filter: 'agDateColumnFilter',
		},
		{
			field: 'dob',
			headerName: 'Date de naissance',
			width: 180,
			filterParams: containFilterParams,
			cellRenderer: (value) => {
				const cellValue = value.valueFormatted ? value.valueFormatted : props.value;
				return <span class='font-bold'>{moment(cellValue).format('LL')}</span>;
			},
		},
		{
			field: 'job_title',
			headerName: 'Fonction',
			width: 180,
			filter: 'agDateColumnFilter',
		},
		{
			field: 'contract_type',
			headerName: 'Type de contrat',
			width: 180,
			filter: 'agDateColumnFilter',
		},
		{
			field: 'gender',
			headerName: 'Genre',
			pinned: 'right',
			width: 180,
			filterParams: containFilterParams,
		},
		{
			field: 'blood_group',
			headerName: 'Groupe sanguin',
			pinned: 'right',
			// cellRenderer: AgTablePriceComponent,
			width: 180,
			filterParams: containFilterParams,
		},
	];

	return (
		<>
			<Show
				when={
					!beneficiariesRessource.loading
					//  &&
					// appStore.beneficiariesList.length > 0
				}
				fallback={<SuspenseContent />}
			>
				<TitleCard
					title={'Liste des bénéficiaires'}
					topMargin='mt-1'
					TopSideButtons={TopSideButtons}
				>
					<div
						class={'ag-theme-alpine'}
						style={{ height: '32rem' }}
					>
						<AgGridSolid
							columnDefs={columnsDefs}
							// rowData={appStore.beneficiariesList}
							rowData={beneficiariesRessource().data.beneficiaries}
							defaultColDef={GLOBAL_CONSTANTS.BENEFICIARY_DEFAULT_COL_DEF}
							pagination={true}
							paginationPageSize={15}
							onSelectionChanged={(val) => {
								const selectedObject = val.api.getSelectedRows()[0];
								openBeneficiaryModal({
									...beneficiaryModalConfig,
									extraObject: {
										data: selectedObject,
										config: { openInReadOnlyMode: true },
									},
								});
							}}
							rowSelection='single'
							// onSelectionChanged: onSelectionChanged,
						/>
					</div>
				</TitleCard>
			</Show>
		</>
	);
};

export default ManageBeneficiary;
