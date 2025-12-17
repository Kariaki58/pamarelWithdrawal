const express = require('express');
const router = express.Router();
const {
  initiateWithdrawal,
  getWithdrawalStatus,
  getAllWithdrawals,
  getBanks,
  verifyAccount,
  getTransferFee
} = require('../controllers/withdrawal.controller');
const { validateWithdrawal, validateAccountVerification } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Withdrawal routes
router.post('/', validateWithdrawal, initiateWithdrawal);
router.get('/', getAllWithdrawals);
router.get('/status/:reference', getWithdrawalStatus);
router.get('/fee', getTransferFee);

// Bank and account verification routes
router.get('/banks', getBanks);
router.post('/verify-account', validateAccountVerification, verifyAccount);

module.exports = router;

