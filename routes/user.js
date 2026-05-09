const { signupUser,loginUser,profile, requestPasswordReset,verifyResetCode,resetPassword,getStats} = require("../controllers/userController");
const express = require("express");
const userAuth  = require("../middlewares/authUser");
const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/me",userAuth.verifyToken, profile);
router.get("/dashboard/stats",userAuth.verifyToken,getStats);
router.post("/reset", resetPassword);
router.post('/request-password-reset', requestPasswordReset);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);

module.exports = router;
