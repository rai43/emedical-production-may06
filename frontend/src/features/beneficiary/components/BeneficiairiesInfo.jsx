import { For, Show, createEffect, onMount } from 'solid-js';
import QRCode from 'qrcode';
import { appStore } from '../../../data/mainStore';
import { rightSidebarState } from '../../../data/rightSidebarState';
import moment from 'moment';
import InputText from '../../../components/Input/InputText';
import BeneficiairyInfo from './BeneficiaryInfo';

const BeneficiairiesInfo = () => {
	return (
		<Show
			when={!!rightSidebarState.extraObject?.data?.beneficiaries?.partner || !!rightSidebarState.extraObject?.data?.beneficiaries?.children?.length > 0}
			fallback={<h3 class='mx-auto mt-5 font-semibold'>Cet agent n'a pas de bénéficiaire</h3>}
		>
			<Show when={rightSidebarState.extraObject?.data?.beneficiaries?.partner}>
				<BeneficiairyInfo
					labelTitle={'Partenaire'}
					family_name={rightSidebarState.extraObject?.data?.beneficiaries?.partner?.family_name}
					first_name={rightSidebarState.extraObject?.data?.beneficiaries?.partner?.first_name}
					blood_group={rightSidebarState.extraObject?.data?.beneficiaries?.partner?.blood_group}
					gender={rightSidebarState.extraObject?.data?.beneficiaries?.partner?.gender}
					health_card_id={rightSidebarState.extraObject?.data?.beneficiaries?.partner?.health_card_id}
					beneficiary_of={rightSidebarState.extraObject?.data?.beneficiaries?.partner?.beneficiary_of.id_number}
					dob={moment(rightSidebarState.extraObject?.data?.beneficiaries?.partner.dob).format('DD/MM/YYYY')}
					doc={moment(rightSidebarState.extraObject?.data?.beneficiaries?.partner.doc).format('DD/MM/YYYY')}
					doe={rightSidebarState.extraObject?.data?.beneficiaries?.partner.doe ? moment(rightSidebarState.extraObject?.data?.beneficiaries?.partner.doe).format('DD/MM/YYYY') : ''}
					picture={`${import.meta.env.VITE_APP_ASSETS_URL}/${rightSidebarState.extraObject?.data?.beneficiaries?.partner.picture}`}
				/>
			</Show>
			<div class='divider mt-5'></div>
			<Show when={rightSidebarState.extraObject?.data?.beneficiaries?.children?.length > 0}>
				<div class='grid grid-cols-3 gap-y-1 justify-items-center'>
					<h2 class='text-2xl font-semibold my-2 col-span-3'>
						Enfant
						{rightSidebarState.extraObject?.data?.beneficiaries?.children?.length > 0 && 's'}
					</h2>
				</div>
				<For each={rightSidebarState.extraObject?.data?.beneficiaries?.children}>
					{(child) => (
						<>
							<BeneficiairyInfo
								family_name={child.family_name}
								first_name={child.first_name}
								sexe={child.gender}
								blood_group={child.blood_group}
								gender={child.gender}
								health_card_id={child.health_card_id}
								beneficiary_of={child.beneficiary_of.id_number}
								dob={moment(child.dob).format('DD/MM/YYYY')}
								doc={moment(child.doc).format('DD/MM/YYYY')}
								doe={child.doe ? moment(child.doe).format('DD/MM/YYYY') : ''}
								picture={`${import.meta.env.VITE_APP_ASSETS_URL}/${child.picture}`}
							/>

							<div class='divider'></div>
						</>
					)}
				</For>
			</Show>
		</Show>
	);
};

export default BeneficiairiesInfo;
