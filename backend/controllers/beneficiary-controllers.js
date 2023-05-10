const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const { json } = require('body-parser');

const Beneficiaries = require('../models/beneficiary');

const countBeneficiaries = async (req, res, next) => {
	let count = 0;
	try {
		count = await Beneficiaries.count({});
	} catch (e) {
		const error = new HttpError("L'obtention de la liste des bénéficiaires a échoué, veuillez réessayer plus tard.", 500);
		return next(error);
	}

	res.json({
		count,
	});
};

const getBeneficiaries = async (req, res, next) => {
	let beneficiaries;
	try {
		beneficiaries = await Beneficiaries.find({ agent_type: 'AGENT' })
			.sort({
				created_at: -1,
			})
			.populate({
				path: 'beneficiaries',
				populate: {
					path: 'children',
					populate: {
						path: 'beneficiary_of',
					},
				},
			})
			.populate({
				path: 'beneficiaries',
				populate: {
					path: 'partner',
					populate: {
						path: 'beneficiary_of',
					},
				},
			});

		// .populate({
		// 	path: 'beneficiaries.children',
		// })
	} catch (e) {
		const error = new HttpError("L'obtention de la liste des bénéficiaires a échoué, veuillez réessayer plus tard.", 500);
		return next(error);
	}

	res.json({
		beneficiaries,
	});
};

const createBeneficiary = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.json({
			error: {
				message: 'Invalid inputs passed, please check your data.',
				code: -2,
			},
		});
	}

	const { family_name, first_name, dob, doc, doe, email, gender, id_number, job_title, direction, contract_type, blood_group, profil, remark, index, agent_type, beneficiary_of } = req.body;

	let existingAgent;

	if (agent_type === 'AGENT') {
		if (!direction || !contract_type || !id_number || !profil || !index) {
			return res.json({
				error: {
					message: "Veuillez completement le formulaire pour créer le compte d'un agent",
					code: -2,
				},
			});
		}
	} else {
		try {
			existingAgent = await Beneficiaries.findOne({
				id_number: beneficiary_of,
			});
		} catch (err) {
			return res.json({
				error: {
					message: 'Erreur lors de la création, veuillez réessayer plus tard.',
					code: -3,
				},
			});
		}

		if (!existingAgent) {
			return res.json({
				error: {
					message: "L'agent n'existe pas, veuillez vérifier les informations de l'agent et réessayer.",
					code: -2,
				},
			});
		}
	}
	// if it is a new 'AGENT', we should assign it's object to existingAgent
	let createdBeneficiary;
	try {
		createdBeneficiary = new Beneficiaries({
			family_name,
			first_name,
			dob,
			doc,
			email,
			gender,
			blood_group,
			remark,
			...(!!index && { index }),
			...(!!agent_type && { agent_type }),
			...(!!profil && { profil }),
			...(!!contract_type && { contract_type }),
			...(!!direction && { direction }),
			...(!!job_title && { job_title }),
			...(!!doe && { doe }),
			picture: req.file.path,
			creator: req.userData.userId,
		});

		let health_card_id = agent_type === 'AGENT' ? id_number : existingAgent.id_number;
		if (agent_type === 'AGENT') {
			existingAgent = createdBeneficiary;
			health_card_id += '01';
		} else if (agent_type === 'CONJOINT') {
			health_card_id += '02';
			// in this case, we need to PUSH the the "createdBeneficiary" object
			// in "existingAgent.beneficiaries.partner"
		} else if (agent_type === 'ENFANT') {
			const childrenCount = existingAgent.beneficiaries.children.length;
			health_card_id += '1' + childrenCount;
			// in this case, we need to PUSH the the "createdBeneficiary" object
			// in "existingAgent.beneficiaries.children"
		}
		// updating the 'beneficiary_of' field
		createdBeneficiary.beneficiary_of = existingAgent._id;
		// updating the 'health_card_id' field
		createdBeneficiary.health_card_id = health_card_id;
		if (!!id_number && agent_type === 'AGENT') {
			createdBeneficiary.id_number = id_number;
		} else {
			createdBeneficiary.id_number = health_card_id;
		}

		try {
			const sess = await mongoose.startSession();
			sess.startTransaction();
			if (agent_type === 'AGENT') {
				existingAgent.beneficiaries = {
					children: [],
				};
			} else if (agent_type === 'CONJOINT') {
				existingAgent.beneficiaries.partner = createdBeneficiary._id;
			} else if (agent_type === 'ENFANT') {
				existingAgent.beneficiaries.children.push(createdBeneficiary._id);
			}
			await existingAgent.markModified('beneficiaries');
			await existingAgent.save({ session: sess });
			await createdBeneficiary.save({ session: sess });
			// commit all the changes at once. If any error, then all operations
			// are cancelled
			await sess.commitTransaction();
		} catch (err) {
			console.log(err);
			return res.json({
				error: {
					message: 'Erreur lors de la création, impossible de sauvegarder les données, veuillez réessayer plus tard.',
					code: -3,
				},
			});
		}
	} catch (err) {
		return res.json({
			error: {
				message: "Échec de l'enregistrement, veuillez réessayer plus tard.",
				code: -3,
			},
		});
	}
	res.status(201).json({ beneficiary: createdBeneficiary });
};

exports.getBeneficiaries = getBeneficiaries;
exports.countBeneficiaries = countBeneficiaries;
exports.createBeneficiary = createBeneficiary;
