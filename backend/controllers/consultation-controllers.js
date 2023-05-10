const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const { json } = require('body-parser');

const Constant = require('../models/constant');
const Beneficiary = require('../models/beneficiary');
const Consultation = require('../models/consultation');
const User = require('../models/user');

const countWaitingConsultations = async (req, res, next) => {
	let count = 0;
	try {
		count = await Consultation.count({ status: 'waiting' });
	} catch (e) {
		const error = new HttpError("L'obtention de la liste des bénéficiaires a échoué, veuillez réessayer plus tard.", 500);
		return next(error);
	}

	res.json({
		count,
	});
};

const getConsultationsForStats = async (req, res, next) => {
	let consultationsDone;
	let consultationsWaiting;
	try {
		consultationsDone = await Consultation.find({ status: { $eq: 'done' }, created_at: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 365) } }).populate({
			path: 'beneficiary',
		});
		consultationsWaiting = await Consultation.find({ status: { $ne: 'done' }, created_at: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 365) } }).populate({
			path: 'beneficiary',
		});
	} catch (e) {
		const error = new HttpError("L'obtention de la liste des consultations a échoué, veuillez réessayer plus tard.", 500);
		return next(error);
	}

	res.json({
		stats_data_done: consultationsDone,
		stats_data_waiting: consultationsWaiting,
	});
};

const getConsultations = async (req, res, next) => {
	let consultations;
	try {
		// consultations = await Consultation.find({ sickness: { $eq: null } })
		consultations = await Consultation.find({ status: { $ne: 'done' } })
			.populate({
				path: 'beneficiary',
				populate: [
					{
						path: 'consultations',
						populate: {
							path: 'constant',
						},
					},
					{
						path: 'beneficiary_of',
					},
				],
			})
			.populate({
				path: 'constant',
			})
			.populate({
				path: 'exams',
			})
			.populate({
				path: 'medical_report',
			})
			.populate({
				path: 'internal_prescriptions',
			})
			.populate({
				path: 'external_prescriptions',
			})
			.populate({
				path: 'medical_acts',
			})
			.sort({
				created_at: 1,
			});
		console.log(consultations.length);
	} catch (e) {
		const error = new HttpError("L'obtention de la liste des consultations a échoué, veuillez réessayer plus tard.", 500);
		return next(error);
	}

	res.json({
		consultations,
	});
};

const getConsultationsDone = async (req, res, next) => {
	let consultations;
	try {
		consultations = await Consultation.find({ status: 'done' })
			.populate({
				path: 'beneficiary',
				populate: {
					path: 'consultations',
					populate: {
						path: 'constant',
					},
				},
			})
			.populate({
				path: 'constant',
			})
			.populate({
				path: 'exams',
			})
			.populate({
				path: 'medical_report',
			})
			.populate({
				path: 'internal_prescriptions',
			})
			.populate({
				path: 'external_prescriptions',
			})
			.populate({
				path: 'medical_acts',
			})
			.sort({
				created_at: -1,
			});
	} catch (e) {
		const error = new HttpError("L'obtention de la liste des constantes a échoué, veuillez réessayer plus tard.", 500);
		return next(error);
	}

	res.json({
		consultations,
	});
};

const updateConsultation = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError('Entrées non valides transmises, veuillez vérifier vos données.', 422));
	}

	const { consultation_id, comment, sickness, consulted_by } = req.body;

	let existingConsultation;
	// let existingBeneficiary;
	let existingConstant;
	try {
		existingConsultation = await Consultation.findById(consultation_id).populate('beneficiary');
		// existingBeneficiary = await Beneficiary.findOne({
		// 	_id: existingConsultation.beneficiary._id,
		// });
		existingConstant = await Constant.findOne({
			_id: existingConsultation.constant,
		});
	} catch (err) {
		const error = new HttpError('Erreur lors de la création, veuillez réessayer plus tard.', 500);
		return next(error);
	}

	if (!existingConsultation) {
		return next(new HttpError("La consultation n'existe pas, veuillez créer des constantes et réessayer.", 422));
	}

	if (!existingConstant) {
		return next(new HttpError("La constante n'existe pas, veuillez créer des constantes et réessayer.", 422));
	}

	let existingUser;
	try {
		existingUser = await User.findById(consulted_by, { _id: 1 });
	} catch (err) {
		console.log(2);
		console.log(consulted_by);
		const error = new HttpError('Erreur lors de la création, veuillez réessayer plus tard.', 500);
		return next(error);
	}

	if (!existingUser) {
		return next(new HttpError("Le consultant n'existe pas, veuillez créer un utilisateur et réessayer.", 422));
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		// existingBeneficiary.consultations.push(existingConsultation._id);
		// await existingBeneficiary.save({ session: sess });

		existingConsultation.status = 'done';
		existingConsultation.comments = comment;
		existingConsultation.sickness = sickness;
		await existingConsultation.save({ session: sess });

		existingConstant.status = 'done';
		await existingConstant.save({ session: sess });

		await sess.commitTransaction();
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erreur lors de la création, veuillez réessayer plus tard.', 500);
		return next(error);
	}
	res.status(201).json({ consultation: existingConsultation });
};

exports.getConsultations = getConsultations;
exports.getConsultationsForStats = getConsultationsForStats;
exports.getConsultationsDone = getConsultationsDone;
exports.updateConsultation = updateConsultation;
exports.countWaitingConsultations = countWaitingConsultations;
