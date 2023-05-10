const express = require('express');
const { check } = require('express-validator');

const medicationControllers = require('../controllers/medication-controllers');
const consultationControllers = require('../controllers/consultation-controllers');
const constantControllers = require('../controllers/constants-controllers');
const examControllers = require('../controllers/exams-controllers');
const internalPrescriptionControllers = require('../controllers/internal-prescription-controllers');
const checkAuth = require('../middlewares/check-auth');
const fileUpload = require('../middlewares/file-upload');

const router = express.Router();

router.use(checkAuth);

router.post('/medication/bmi', medicationControllers.createBulkMedications);

module.exports = router;
