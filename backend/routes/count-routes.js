const express = require('express');
const { check } = require('express-validator');

const beneficiaryControllers = require('../controllers/beneficiary-controllers');
const consultationControllers = require('../controllers/consultation-controllers');
const constantControllers = require('../controllers/constants-controllers');
const examControllers = require('../controllers/exams-controllers');
const internalPrescriptionControllers = require('../controllers/internal-prescription-controllers');
const checkAuth = require('../middlewares/check-auth');
const fileUpload = require('../middlewares/file-upload');

const router = express.Router();

router.use(checkAuth);

router.get('/cb', beneficiaryControllers.countBeneficiaries);
router.get('/consultations/cwc', consultationControllers.countWaitingConsultations);
router.get('/constants/cwcst', constantControllers.countWaitingConstants);
router.get('/exams/cwe', examControllers.countWaitingExams);
router.get('/inter-presc/cwip', internalPrescriptionControllers.countWaitingPrescriptions);
router.get('/global/gcfs', consultationControllers.getConsultationsForStats);

module.exports = router;
