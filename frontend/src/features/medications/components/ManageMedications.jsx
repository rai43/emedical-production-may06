import AgGridSolid from 'ag-grid-solid';
import TitleCard from '../../../components/Cards/TitleCard';
import ElementViewer from '../../../components/ElementViewer/ElementViewer';
import { makeFakeData } from '../../../data/devData/beneficiary';
import { openBeneficiaryModal } from '../../../data/modalState/beneficiarySlice';
import { GLOBAL_CONSTANTS } from '../../../utils/globalConstantUtil';
import { containFilterParams } from '../../../../helpers/helperFunctions';
import { Show, createEffect, createResource, createSignal, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import moment from 'moment';
import { appStore } from '../../../data/mainStore';
import { setMedicationsList } from '../../../data/mainStoreFunctions';
import axios from 'axios';
import { isUserLoggedIn } from '../../../components/helpers/AuthenticationService';
import toast from 'solid-toast';
import { openModal } from '../../../data/modalState';
import SuspenseContent from '../../../containers/SuspenseContent';

const medicationModalConfig = {
	title: 'Ajouter un Médicament',
	size: 'lg',
	bodyType: GLOBAL_CONSTANTS.MODAL_BODY_TYPES.MEDICATION_NEW,
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
				onClick={() => openModal(medicationModalConfig)}
			>
				Ajouter un médicaments
			</button>
		</div>
	);
};

const fetchMedications = async () => {
	if (localStorage.getItem('token') || appStore.userLoginInfo.token) {
		let response;
		try {
			response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/medication`);
		} catch (err) {
			toast.error("Erreur lors de l'obtention des medicaments");
		}
		return response;
	}
};

const [fetcherSignal, setFetcherSignal] = createSignal(1);
export const [medicationsRessource, { mutate, refetch }] = createResource(fetcherSignal(), fetchMedications);

function ManageMedications() {
	const navigate = useNavigate();

	createEffect(() => {
		if (medicationsRessource.error) {
			if (!isUserLoggedIn()) {
				toast.error('Oops! il semble que votre session a expiré. Reconnectez-vous.');
				setTimeout(() => {
					return navigate('/login', { replace: true });
				}, 3000);
			}
		}
		if (!medicationsRessource.loading) {
			setMedicationsList(medicationsRessource().data.medications);
		}
	});

	const containFilterParams = {
		filterOptions: ['contains', 'notContains'],
		debounceMs: 200,
		maxNumConditions: 1,
	};

	const columnsDefs = [
		{
			field: 'commercial_name',
			headerName: 'Nom commercial',
			width: 250,
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
			field: 'price',
			headerName: 'Prix',
			width: 200,
			filter: 'agDateColumnFilter',
		},
		{
			field: 'dci',
			headerName: 'DCI',
			width: 280,
			filter: 'agDateColumnFilter',
		},
		{
			field: 'therapeutic_class',
			headerName: 'Classe therapeutique',
			width: 280,
			filterParams: containFilterParams,
			cellRenderer: (value) => {
				const cellValue = value.valueFormatted ? value.valueFormatted : value.value;
				return <span class='font-bold'>{cellValue}</span>;
			},
		},
		{
			field: 'presentation',
			headerName: 'Présentation',
			width: 280,
			filter: 'agDateColumnFilter',
		},
		{
			field: 'quantity',
			headerName: 'Quantité restante',
			width: 200,
			pinned: 'right',
			filterParams: containFilterParams,
			cellRenderer: (value) => {
				const cellValue = value.valueFormatted ? value.valueFormatted : value.value;
				return <span class='font-bold'>{cellValue}</span>;
			},
		},
	];

	return (
		<>
			<Show
				when={!medicationsRessource.loading}
				fallback={<SuspenseContent />}
			>
				<TitleCard
					title={'Liste des médicaments'}
					topMargin='mt-1'
					TopSideButtons={TopSideButtons}
				>
					<div
						class={'ag-theme-alpine'}
						style={{ height: '32rem' }}
					>
						<AgGridSolid
							columnDefs={columnsDefs}
							rowData={medicationsRessource().data.medications}
							defaultColDef={GLOBAL_CONSTANTS.AG_GRID_DEFAULT_COL_DEF}
							pagination={true}
							paginationPageSize={15}
							onSelectionChanged={(val) => {
								const selectedObject = val.api.getSelectedRows()[0];
								openModal({
									...medicationModalConfig,
									extraObject: {
										data: selectedObject,
										config: { openInReadOnlyMode: true },
									},
								});
							}}
							rowSelection='single'
						/>
					</div>
				</TitleCard>
			</Show>
		</>
	);
}

export default ManageMedications;
