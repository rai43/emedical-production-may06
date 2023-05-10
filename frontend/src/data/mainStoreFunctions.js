import { produce } from 'solid-js/store';
import { appStore, setAppStore } from './mainStore';
import { createEffect, createResource } from 'solid-js';
import axios from 'axios';
import { refetch as consultationRefetch } from '../features/consultations/components/ManageConsultations';
import { refetch as constantRefetch } from '../features/constants/components/ManageConstants';
import { refetch as consultationHistoryRefetch } from '../features/consultationsHistory/components/ManageConsultationsHistory';
import { refetch as beneficiaryRefetch } from '../features/beneficiary/components/ManageBeneficiary';
import { refetch as examRefetch } from '../features/exams/components/ManageExams';
import { refetch as medicationRefetch } from '../features/medications/components/ManageMedications';
import { refetch as medicalActRefetch } from '../features/medical_act/components/ManageMedicalAct';
import { refetch as usersRefetch } from '../features/user/components/ManageUsers';
import { refetch as internalPrescriptionRefetch } from '../features/internal_prescriptions/components/ManageInternalPrescriptions';
// import { refetch as countWaitingConsultationRefetch, refetchCst, refetchEx, refetchIP, refetchGCFS } from '../features/dashboard';

export const reloadAppAfterOperation = () => {
	consultationRefetch();
	constantRefetch();
	consultationHistoryRefetch();
	beneficiaryRefetch();
	examRefetch();
	medicationRefetch();
	medicalActRefetch();
	usersRefetch();
	internalPrescriptionRefetch();
	// refetchGCFS();
	// countWaitingConsultationRefetch();
	// refetchCst();
	// refetchEx();
	// refetchIP();
};

export const setPageTitle = (title) => {
	setAppStore(produce((state) => (state.pageTitle = title)));
};

export const setLoginInfo = (info) => {
	setAppStore(produce((state) => (state.userLoginInfo = info)));
};

export const setUserGeneralInfo = (info) => {
	setAppStore(produce((state) => (state.userGeneralInfo = info)));
};

export const setBeneficiariesList = (data) => {
	setAppStore(produce((state) => (state.beneficiariesList = data)));
};

export const setConstantsList = (data) => {
	setAppStore(produce((state) => (state.constantsList = data)));
};

export const setConsultationsList = (data) => {
	setAppStore(produce((state) => (state.consultationsList = data)));
};

export const setConsultationsListDone = (data) => {
	setAppStore(produce((state) => (state.consultationsListDone = data)));
};

export const setExamsList = (data) => {
	setAppStore(produce((state) => (state.examsList = data)));
};

export const setMedicationsList = (data) => {
	setAppStore(produce((state) => (state.medicationsList = data)));
};

export const setMedicalActsList = (data) => {
	setAppStore(produce((state) => (state.medicalActsList = data)));
};
