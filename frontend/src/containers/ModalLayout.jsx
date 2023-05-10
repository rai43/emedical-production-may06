import { Show, lazy } from 'solid-js';

const AddBeneficiaryForm = lazy(() => import('../features/beneficiary/components/AddBeneficiaryForm'));
const AddConstantsForm = lazy(() => import('../features/constants/components/AddConstantsForm'));
const AddConsultationForm = lazy(() => import('../features/consultations/components/AddConsultationsForm'));
const DetailsConsultationView = lazy(() => import('../features/consultationsHistory/components/DetailsConsultationView'));
const AddExamDiagnosticForm = lazy(() => import('../features/exams/components/AddExamDiagnosticForm'));
const AddMedicationsForm = lazy(() => import('../features/medications/components/AddMedicationsForm'));
const AddMedicalActObservation = lazy(() => import('../features/medical_act/components/AddMedicalActObservation'));
const CreateNewUserForm = lazy(() => import('../features/user/components/CreateNewUserForm'));
const AddInternalPrescriptionStatusForm = lazy(() => import('../features/internal_prescriptions/components/AddInternalPrescriptionStatusForm'));

import { GLOBAL_CONSTANTS } from '../utils/globalConstantUtil';
import { closeModal, modalState } from '../data/modalState';

function ModalLayout() {
	const close = (e) => {
		closeModal(e);
	};

	return (
		<>
			{/* The button to open modal */}

			{/* Put this part before </body> tag */}
			<div class={`modal ${modalState.isOpen ? 'modal-open' : ''}`}>
				<div class={`modal-box  ${modalState.size === 'lg' ? 'max-w-5xl' : ''}`}>
					<button
						class='btn btn-sm btn-circle absolute right-2 top-2'
						onClick={() => close()}
					>
						✕
					</button>
					<h3 class='font-semibold text-2xl pb-6 text-center'>{modalState.title}</h3>
					<Show when={modalState.bodyType === GLOBAL_CONSTANTS.MODAL_BODY_TYPES.BENEFICIARY_NEW}>
						<AddBeneficiaryForm onCloseModal={close} />
					</Show>
					<Show when={modalState.bodyType === GLOBAL_CONSTANTS.MODAL_BODY_TYPES.USER_NEW}>
						<CreateNewUserForm onCloseModal={close} />
					</Show>
					<Show when={modalState.bodyType === GLOBAL_CONSTANTS.MODAL_BODY_TYPES.CONSTANTS_NEW}>
						<AddConstantsForm onCloseModal={close} />
					</Show>
					<Show when={modalState.bodyType === GLOBAL_CONSTANTS.MODAL_BODY_TYPES.CONSULTATIONS_NEW}>
						<AddConsultationForm onCloseModal={close} />
					</Show>
					<Show when={modalState.bodyType === GLOBAL_CONSTANTS.MODAL_BODY_TYPES.CONSULTATIONS_DONE_DETAILS}>
						<DetailsConsultationView onCloseModal={close} />
					</Show>
					<Show when={modalState.bodyType === GLOBAL_CONSTANTS.MODAL_BODY_TYPES.EXAMS_NEW}>
						<AddExamDiagnosticForm onCloseModal={close} />
					</Show>
					<Show when={modalState.bodyType === GLOBAL_CONSTANTS.MODAL_BODY_TYPES.INTERNAL_PRESCRIPTIONS_NEW}>
						<AddInternalPrescriptionStatusForm onCloseModal={close} />
					</Show>
					<Show when={modalState.bodyType === GLOBAL_CONSTANTS.MODAL_BODY_TYPES.MEDICATION_NEW}>
						<AddMedicationsForm onCloseModal={close} />
					</Show>
					<Show when={modalState.bodyType === GLOBAL_CONSTANTS.MODAL_BODY_TYPES.MEDICAL_ACT_NEW}>
						<AddMedicalActObservation onCloseModal={close} />
					</Show>
				</div>
			</div>
		</>
	);
}

export default ModalLayout;
