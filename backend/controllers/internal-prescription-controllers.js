const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const { json } = require('body-parser');

const InternalPrescription = require('../models/internal-prescription');
const Medication = require('../models/medication');
const Consultation = require('../models/consultation');
const User = require('../models/user');

const getInternalPrescriptions = async (req, res, next) => {
	let examsGroupedByConsultation;
	try {
		internalPrescriptionsGroupedByConsultationId = await InternalPrescription.aggregate([
			{
				$match: {
					status: 'waiting',
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'doctor',
					foreignField: '_id',
					as: 'doctor',
				},
			},
			{
				$unwind: {
					path: '$doctor',
				},
			},
			{
				$project: {
					'doctor.password': 0,
				},
			},
			{
				$set: {
					doctor_info: {
						$concat: ['$doctor.first_name', '  ', '$doctor.first_name', ' - ', '$doctor.id_number'],
					},
				},
			},
			{
				$group: {
					_id: '$consultation',
					internal_prescriptions: {
						$push: '$$ROOT',
					},
				},
			},
			{
				$lookup: {
					from: 'consultations',
					localField: '_id',
					foreignField: '_id',
					as: 'consultation_data',
				},
			},
			{
				$unwind: {
					path: '$consultation_data',
				},
			},
			{
				$lookup: {
					from: 'beneficiaries',
					localField: 'consultation_data.beneficiary',
					foreignField: '_id',
					as: 'beneficiary_info',
				},
			},
			{
				$unwind: {
					path: '$beneficiary_info',
				},
			},
			{
				$lookup: {
					from: 'constants',
					localField: 'consultation_data.constant',
					foreignField: '_id',
					as: 'constant_info',
				},
			},
			{
				$unwind: {
					path: '$constant_info',
				},
			},
		]);
		// console.log('internalPrescriptionsGroupedByConsultationId: ', internalPrescriptionsGroupedByConsultationId);
	} catch (e) {
		console.log(e);
		const error = new HttpError("L'obtention de la liste des ordonnances a échoué, veuillez réessayer plus tard.", 500);
		return next(error);
	}

	res.json({
		internal_prescriptions: internalPrescriptionsGroupedByConsultationId,
	});
};

const createInternalPrescription = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors);
		return next(new HttpError('Entrées non valides transmises, veuillez vérifier vos données.', 422));
	}

	const {
		// medication,
		// posology,
		// duration,
		// quatity,
		prescription_list,
		consultation_id,
		consulted_by,
	} = req.body;

	let existingUser;
	try {
		existingUser = await User.findById(consulted_by, { _id: 1 });
	} catch (err) {
		const error = new HttpError('Erreur lors de la création, veuillez réessayer plus tard.', 500);
		return next(error);
	}

	if (!existingUser) {
		return next(new HttpError("Le medecin n'existe pas, veuillez créer un utilisateur et réessayer.", 422));
	}

	let existingConsultation;
	try {
		existingConsultation = await Consultation.findById(consultation_id);
	} catch (err) {
		const error = new HttpError('Erreur lors de la création des ordonnances, veuillez réessayer plus tard.', 500);
		return next(error);
	}

	if (!existingConsultation) {
		return next(new HttpError("La consultation n'existe pas, veuillez créer une consultation et réessayer.", 422));
	}

	// creating the prescriptions
	const prescriptionsToBeSaved = prescription_list.map((prescription) => {
		return {
			...prescription,
			consultation: existingConsultation._id,
			doctor: existingUser._id,
		};
	});

	let prescriptionsList;
	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		prescriptionsList = await InternalPrescription.insertMany(prescriptionsToBeSaved, { session: sess });

		await Consultation.updateOne({ _id: existingConsultation._id }, { $push: { internal_prescriptions: { $each: prescriptionsList } } }, { session: sess });

		// existingBeneficiary.internal_prescriptions.push(existingConsultation._id);
		// await existingBeneficiary.save({ session: sess });

		await sess.commitTransaction();
	} catch (err) {
		console.log(3);
		console.log(err);
		const error = new HttpError('Erreur lors de la création, veuillez réessayer plus tard.', 500);
		return next(error);
	}
	res.status(201).json({ prescriptionsList });
};

const markInternalPrescriptionAsDone = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors);
		return next(new HttpError('Entrées non valides transmises, veuillez vérifier vos données.', 422));
	}

	let { pid, served_quantity } = req.body;

	let existingInternalPrescription;
	try {
		existingInternalPrescription = await InternalPrescription.findById(pid);
	} catch (e) {
		const error = new HttpError("Une erreur s'est produite, impossible de mettre à jour la liste des medicaments.", 500);
		return next(error);
	}

	if (!existingInternalPrescription) {
		const error = new HttpError("Impossible de modifier l'ordonnance", 422);
		return next(error);
	}

	served_quantity = served_quantity ? served_quantity : 0;

	if (parseInt(served_quantity) + (parseInt(existingInternalPrescription?.served_quantity) || 0) > existingInternalPrescription.quantity) {
		return res.json({
			error: {
				message: 'La quantité démandée est superieure à la quantité prescrite',
				code: -2,
			},
		});
	}

	let existingMedication;
	try {
		existingMedication = await Medication.findOne({ commercial_name: existingInternalPrescription.medication });
	} catch (e) {
		const error = new HttpError("Une erreur s'est produite, impossible de mettre à jour la liste des medicaments.", 500);
		return next(error);
	}

	if (!existingMedication) {
		const error = new HttpError("Le medicament n'existe pas dans notre base de données", 422);
		return next(error);
	}

	if (existingMedication.quantity < served_quantity) {
		return res.json({
			error: {
				message: 'La quantité démandée est inferieure à la quantité restante en stock',
				code: -2,
			},
		});
	}

	existingInternalPrescription.status =
		parseInt(served_quantity) + (parseInt(existingInternalPrescription?.served_quantity) || 0) === parseInt(existingInternalPrescription.quantity) ? 'done' : 'waiting';
	if (existingInternalPrescription.served_quantity) {
		existingInternalPrescription.served_quantity = parseInt(existingInternalPrescription.served_quantity) + parseInt(served_quantity);
	} else {
		existingInternalPrescription.served_quantity = parseInt(served_quantity);
	}
	existingMedication.quantity = parseInt(existingMedication.quantity) - parseInt(served_quantity);

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await existingInternalPrescription.save({ session: sess });
		await existingMedication.save({ session: sess });
		await sess.commitTransaction();
	} catch (e) {
		console.log(e);
		const error = new HttpError("Une erreur s'est produite, impossible de mettre à jour cette ordonnance.", 500);
		return next(error);
	}

	res.status(200).json({ internal_prescription: existingInternalPrescription });
};

exports.getInternalPrescriptions = getInternalPrescriptions;
exports.createInternalPrescription = createInternalPrescription;
exports.markInternalPrescriptionAsDone = markInternalPrescriptionAsDone;
