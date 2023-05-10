import { FiUploadCloud } from 'solid-icons/fi';
import dragDrop from 'drag-drop';
import readXlsxFile from 'read-excel-file';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Show, createSignal, onMount } from 'solid-js';
import TitleCard from '../../../components/Cards/TitleCard';
import axios from 'axios';
import toast from 'solid-toast';
import { reloadAppAfterOperation } from '../../../data/mainStoreFunctions';
import { closeModal } from '../../../data/modalState';
// import { el } from '@fullcalendar/core/internal-common';

const AddBulkMedication = () => {
	const [showUploadButton, setShowUploadButton] = createSignal(false);
	const [info, setInfo] = createSignal('');
	const [data, setData] = createSignal([]);

	const manageFileDrop = () => {
		readXlsxFile(input.files[0]).then((rows) => {
			let finalRows;
			if (rows.length > 1) {
				finalRows = rows
					.map((row) => {
						if (row[0].length > 0 && row[1] > 0 && row[2].length > 0 && row[3].length > 0 && row[4].length > 0) {
							row = row.map((elt) => {
								return typeof elt === 'string' ? elt.toLocaleUpperCase() : elt;
							});
							return row;
						}
					})
					.filter((elt) => elt != undefined);
				if (finalRows.length < 1) return;
				setShowUploadButton(true);
				setData(finalRows);
			} else {
				setShowUploadButton(false);
				return;
			}

			setInfo(`${finalRows.length} ligne(s) téléchargées`);
		});
	};

	const saveMedications = async (collectedJsonValues) => {
		const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/bulk/medication/bmi', collectedJsonValues, {
			headers: {
				'Content-Type': 'application/json',
			},
			authorization: 'Bearer ' + (localStorage.getItem('token') || appStore.userLoginInfo.token),
		});
		return response;
	};

	const onSubmit = async () => {
		const collectedJsonValues = JSON.stringify({ medications: data() });

		toast.promise(saveMedications(collectedJsonValues), {
			loading: 'Enregistrement des médicaments ...',
			success: (val) => {
				reloadAppAfterOperation();
				closeModal();
				setData([]);
				setInfo('');
				setShowUploadButton(false);
				return <span>Medicaments enregistrés</span>;
			},
			error: () => {
				return <span>Erreur lors de la création. Verifier l'existence du bénéficiaire et réessayer</span>;
			},
		});
	};

	return (
		<>
			<TitleCard
				title={'Bulk ajout de médicaments'}
				topMargin='mt-1'
			>
				<div
					class='max-w-xl mx-auto'
					id='dropTarget'
				>
					<label class='flex justify-center w-full h-32 px-4 transition bg-transparent border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none'>
						<span class='flex items-center space-x-2'>
							<FiUploadCloud class='h-6 w-6' />
							<span class='font-medium text-gray-600'>Déposer le fichier</span>
						</span>
						<input
							type='file'
							id='input'
							onChange={manageFileDrop}
							hidden
						/>
					</label>
				</div>
				<div class='container mx-auto my-5'>{info()}</div>
				<Show when={showUploadButton()}>
					<button
						class='btn btn-outline btn-primary w-full'
						onClick={onSubmit}
					>
						Enregistrer
					</button>
				</Show>
			</TitleCard>
		</>
	);
};

export default AddBulkMedication;
