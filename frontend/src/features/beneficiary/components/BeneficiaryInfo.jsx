import { For, Show, createEffect, onMount } from 'solid-js';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import logoCnps from '../../../assets/logoCnps.jpeg';
import moment from 'moment';
import InputText from '../../../components/Input/InputText';

const BeneficiairyInfo = (props) => {
	let qrCodeCanvasRef;
	let cardPdf;

	const onDownload = () => {
		const doc = new jsPDF();

		doc.html(cardPdf, {
			callback: function (doc) {
				// Save the PDF
				doc.save('card.pdf');
			},
			x: 15,
			y: 15,
			width: 170, //target width in the PDF document
			windowWidth: 650, //window width in CSS pixels
		});
	};

	createEffect(() => {
		let qrCodeData = {
			family_name: props.family_name,
			first_name: props.first_name,
			blood_group: props.blood_group,
			gender: props.gender,
			health_card_id: props.health_card_id,
			dob: props.dob,
			doc: props.doc,
			doe: props.doe,
		};
		qrCodeData = JSON.stringify(qrCodeData);
		QRCode.toCanvas(
			qrCodeCanvasRef,
			// QR code doesn't work with an empty string
			// so I'm using a blank space as a fallback
			qrCodeData || ' ',
			(error) => error && console.error(error)
		);
	});

	return (
		<>
			<Show when={props?.labelTitle}>
				<div class='grid grid-cols-1 gap-y-1 justify-items-center'>
					{/* rightSidebarState.extraObject */}
					<h2 class='text-2xl font-semibold my-2 col-span-3'>{props?.labelTitle}</h2>
				</div>
			</Show>
			<div class='grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1'>
				<div>
					<InputText
						type='text'
						name='family_name'
						placeholder='Nom'
						defaultValue={props.family_name}
						containerStyle='mt-1'
						labelTitle='Nom'
						disabled={true}
					/>
				</div>
				<div class='col-span-2'>
					<InputText
						type='text'
						placeholder='Prénom(s)'
						defaultValue={props.first_name}
						containerStyle='mt-1'
						labelTitle='Prénom(s)'
						disabled={true}
					/>
				</div>
				<div>
					<InputText
						type='text'
						name='blood_group'
						placeholder='Groupe sanguin'
						defaultValue={props.blood_group}
						containerStyle='mt-1'
						labelTitle='Groupe sanguin'
						disabled={true}
					/>
				</div>
				<div>
					<InputText
						type='text'
						name='gender'
						placeholder='Genre'
						defaultValue={props.gender}
						containerStyle='mt-1'
						labelTitle='Genre'
						disabled={true}
					/>
				</div>
				<div>
					<InputText
						type='text'
						placeholder='Date de naissance'
						defaultValue={moment(props.dob).format('DD/MM/YYYY')}
						containerStyle='mt-1'
						labelTitle='Date de naissance'
						disabled={true}
					/>
				</div>
				<div>
					<InputText
						type='text'
						placeholder='N. Carte Santé'
						defaultValue={props.health_card_id}
						containerStyle='mt-1'
						labelTitle='N. Carte Santé'
						disabled={true}
					/>
				</div>
				<div>
					<InputText
						type='text'
						placeholder="Date d'incorporation"
						defaultValue={moment(props.doc).format('DD/MM/YYYY')}
						containerStyle='mt-1'
						labelTitle="Date d'incorporation"
						disabled={true}
					/>
				</div>
				<div>
					<InputText
						type='text'
						placeholder="Date d'expiration"
						defaultValue={moment(props.doe).format('DD/MM/YYYY')}
						containerStyle='mt-1'
						labelTitle="Date d'expiration"
						disabled={true}
					/>
				</div>

				<img
					class='w-full h-full object-cover'
					src={props.picture}
					alt='Preview'
					style={{ 'max-width': '120px', 'max-height': '120px' }}
				/>
				<button
					class='btn btn-outline btn-primary mx-auto my-auto'
					onClick={onDownload}
					type='button'
				>
					Telecharger la carte
				</button>
			</div>

			<div class='grid grid-cols-1 md:grid-cols-1 gap-x-4 gap-y-1 my-7 hidden'>
				<div
					class='col-start-1 mx-auto'
					ref={cardPdf}
				>
					<div class='w-[27rem] h-[16rem] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
						<div class='grid grid-cols-4 gap-x-4 gap-y-1 justify-items-center bg-blue-950 border px-2 py-1'>
							<div class=''>
								<img
									src={logoCnps}
									alt='Cnps logo'
									class='w-46 inline-block '
									style={{ 'max-width': '120px', 'max-height': '120px', 'margin-left': '2rem' }}
								/>
							</div>
							<div class='col-span-3'>
								<div class='grid grid-rows-2 text-white'>
									<div>CARTE DE SANTÉ</div>
									<div>Adhérant(e): {props.beneficiary_of}</div>
								</div>
							</div>
						</div>
						<div class='grid grid-rows-6 p-1 h-[14rem]'>
							<div class='justify-self-center text-sm'>
								<span class='font-semibold'>Bénéficiaire:</span> <span class='font-semibold text-primary'>{props.health_card_id}</span>
							</div>

							<div class='row-span-4'>
								<div class='grid grid-cols-4 gap-x-4 gap-y-1 '>
									<div class='my-auto'>
										<img
											class='w-full h-full object-cover'
											src={props.picture}
											alt='Preview'
											style={{ 'max-width': '90px', 'max-height': '90px' }}
										/>
									</div>

									<div class='col-span-2 text-[10px] font-semibold'>
										<div class='grid grid-cols-5 gap-x-4 gap-y-1 p-3 justify-self-center'>
											<div class='font-bold col-span-3'>Date de naissance</div>
											<div class='col-span-2 font-semibold'>{props.dob}</div>
											<div class='font-bold col-span-3'>Sexe</div>
											<div class='col-span-2 font-semibold'>{props.gender?.toLocaleUpperCase()}</div>
											<div class='font-bold col-span-3'>Groupe sanguin</div>
											<div class='col-span-2 font-semibold'>{props.blood_group?.toLocaleUpperCase()}</div>
											<div class='font-bold col-span-3'>N carte de santé</div>
											<div class='col-span-2 font-semibold'>{props.health_card_id?.toLocaleUpperCase()}</div>
											<div class='font-bold col-span-3'>Incorporation</div>
											<div class='col-span-2 font-semibold'>{props.doc?.toLocaleUpperCase()}</div>
											<div class='font-bold col-span-3'>Date déxpiration</div>
											<div class='col-span-2 font-semibold'>{props.doe}</div>
										</div>
									</div>

									<div class='my-auto justify-self-center'>
										<canvas
											style={{ 'max-width': '80px', 'max-height': '80px' }}
											class=''
											ref={qrCodeCanvasRef}
										/>
									</div>
								</div>
							</div>
							<div class='justify-self-center text-[8px] font-semibold'>01 BP 317 Abidjan 01 - Tél: 20 252 100/06 - Fax: 20 252 170/20 317 994</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default BeneficiairyInfo;
