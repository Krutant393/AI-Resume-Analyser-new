const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const multer = require('multer');
const {
    registerController
} = require('../controllers/authController');
const { loginController } = require('../controllers/authController');
const analysisModel = require('../models/analysisModel');
const {
    analysisController
} = require('../controllers/analysisController');
const { uploadPDF, responseController } = require('../controllers/analysisController');

const { authMiddleware } = require('../middlewares/auth.middleware');

const upload = multer({
    storage: multer.memoryStorage()
})
router.post(
    "/upload",
    authMiddleware,
    upload.single("pdf"),
    uploadPDF
);

router.post('/analysis/:resumeId', authMiddleware, analysisController);

router.post('/register', registerController);

router.post('/login', loginController);

router.get('/analysis/:resumeId/response', authMiddleware, responseController);



module.exports = router;