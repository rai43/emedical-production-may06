import { lazy } from 'solid-js';
import { VsClose } from 'solid-icons/vs';

const AddExternalPrescriptionForm = lazy(() => import('../features/external_prescriptions/components/AddExternalPrescriptionForm'));
const AddMedicalAct = lazy(() => import('../features/medical_act/components/AddMedicalAct'));
const AddInternalPrescriptionForm = lazy(() => import('../features/internal_prescriptions/components/AddInternalPrescriptionForm'));
const GenerateMedicalCertificate = lazy(() => import('../features/medical_certificate/component/GenerateMedicalCertificate'));
const AddExamsForm = lazy(() => import('../features/exams/components/AddExamsForm'));
const BeneficiaryCard = lazy(() => import('../features/beneficiary/components/BeneficiaryCard'));
const History = lazy(() => import('../features/consultations/components/actions/History'));
const BeneficiairiesInfo = lazy(() => import('../features/beneficiary/components/BeneficiairiesInfo'));

import { closeRightSideBar, rightSidebarState } from '../data/rightSidebarState';
import { GLOBAL_CONSTANTS } from '../utils/globalConstantUtil';

function RightSidebar() {
	const close = (e) => {
		closeRightSideBar();
	};

	return (
		<div
			className={
				' fixed overflow-hidden z-[1000] bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out ' +
				(rightSidebarState.isOpen ? ' transition-opacity opacity-100 duration-500 translate-x-0  ' : ' transition-all delay-500 opacity-0 translate-x-full  ')
			}
		>
			<section
				className={
					'w-80 md:w-2/3 right-0 absolute bg-base-100 h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  ' +
					(rightSidebarState.isOpen ? ' translate-x-0 ' : ' translate-x-full ')
				}
			>
				<div className='relative pb-5 flex flex-col  h-full'>
					{/* Header */}
					<div className='navbar flex pl-4 pr-4   shadow-md '>
						<button
							className='float-left btn btn-circle btn-outline btn-sm'
							onClick={() => close()}
						>
							<VsClose lassName='h-5 w-5' />
						</button>
						<span className='ml-2 font-bold text-xl'>{rightSidebarState.header}</span>
					</div>

					{/* ------------------ Content Start ------------------ */}
					<div className='overflow-y-scroll pl-4 pr-4'>
						<div className='flex flex-col w-full'>
							{/* Loading drawer body according to different drawer type */}
							<Show when={rightSidebarState.bodyType === GLOBAL_CONSTANTS.RIGHT_SIDE_DRAWER.BENEFICIARY_INFO}>
								<BeneficiairiesInfo />
							</Show>
							<Show when={rightSidebarState.bodyType === GLOBAL_CONSTANTS.RIGHT_SIDE_DRAWER.BENEFICIARY_HISTORY}>
								<History />
							</Show>
							<Show when={rightSidebarState.bodyType === GLOBAL_CONSTANTS.RIGHT_SIDE_DRAWER.BENEFICIARY_CARD}>
								<BeneficiaryCard />
							</Show>
							<Show when={rightSidebarState.bodyType === GLOBAL_CONSTANTS.RIGHT_SIDE_DRAWER.EXAMENS_NEW}>
								<AddExamsForm />
							</Show>
							<Show when={rightSidebarState.bodyType === GLOBAL_CONSTANTS.RIGHT_SIDE_DRAWER.MEDICAL_CERTIFICAT_NEW}>
								<GenerateMedicalCertificate />
							</Show>
							<Show when={rightSidebarState.bodyType === GLOBAL_CONSTANTS.RIGHT_SIDE_DRAWER.INTERNAL_PRESCRIPTION_NEW}>
								<AddInternalPrescriptionForm />
							</Show>
							<Show when={rightSidebarState.bodyType === GLOBAL_CONSTANTS.RIGHT_SIDE_DRAWER.MEDICAL_ACT_NEW}>
								<AddMedicalAct />
							</Show>
							<Show when={rightSidebarState.bodyType === GLOBAL_CONSTANTS.RIGHT_SIDE_DRAWER.EXTERNAL_PRESCRIPTION_NEW}>
								<AddExternalPrescriptionForm />
							</Show>
							{/* {
                {
                  [RIGHT_DRAWER_TYPES.NOTIFICATION]: (
                    <NotificationBodyRightDrawer
                      {...extraObject}
                      closeRightDrawer={close}
                    />
                  ),
                  [RIGHT_DRAWER_TYPES.DEFAULT]: <div></div>,
                }[bodyType]
              } */}
						</div>
					</div>
					{/* ------------------ Content End ------------------ */}
				</div>
			</section>

			<section
				className=' w-screen h-full cursor-pointer '
				onClick={() => close()}
			></section>
		</div>
	);
}

export default RightSidebar;
