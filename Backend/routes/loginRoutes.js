const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const multer = require('multer');
const {
    registerController,
    loginController,
    logoutController
} = require('../controllers/authController');
const {
    analysisController,
    uploadPDF,
    responseController,
    historyController
} = require('../controllers/analysisController');

const { authMiddleware } = require('../middlewares/auth.middleware');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post(
    "/upload",
    authMiddleware,
    upload.single("pdf"),
    uploadPDF
);

router.post('/analysis/:resumeId', authMiddleware, analysisController);
router.get('/analysis/:resumeId/response', authMiddleware, responseController);
router.get('/history', authMiddleware, historyController);


router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', logoutController);

router.get("/me", authMiddleware, async(req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "Authenticated",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error fetching user" });
    }
});

module.exports = router;