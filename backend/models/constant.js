const { text } = require('express');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const constantSchema = new Schema(
	{
		card_number: {
			type: String,
			required: true,
		},
		temperature: {
			type: Number,
			required: true,
		},
		height: {
			type: Number,
			required: true,
		},
		weight: {
			type: Number,
			required: true,
		},
		pulse: {
			type: Number,
			required: true,
		},
		blood_pressure: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			required: true,
			default: 'waiting',
		},
		imc: {
			type: Number,
			required: true,
			default: 0,
		},

		// Moins de 18.5 : Poids insuffisant et pouvant occasionner certains risques pour la santé.
		// Entre 18.5 et 24.9 : Poids santé qui n'augmente pas les risques pour la santé.
		// Entre 25 et 29.9 : Excès de poids pouvant occasionner certains risques pour la santé.
		// Plus de 30 : Obésité, risque accru de développer certaines maladies.
		imc_interpretation: {
			type: String,
			required: true,
			default: '',
		},
		other: {
			type: String,
			required: true,
		},
		beneficiary: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: 'beneficiaries',
		},
	},
	{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

constantSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Constant', constantSchema);
