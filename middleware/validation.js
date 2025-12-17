const { body, query, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Validate withdrawal request
 */
const validateWithdrawal = [
  body('account_bank')
    .notEmpty()
    .withMessage('Bank code is required')
    .isString()
    .withMessage('Bank code must be a string'),
  
  body('account_number')
    .notEmpty()
    .withMessage('Account number is required')
    .isString()
    .withMessage('Account number must be a string')
    .isLength({ min: 10, max: 10 })
    .withMessage('Account number must be 10 digits'),
  
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 1 })
    .withMessage('Amount must be a positive number'),
  
  body('currency')
    .optional()
    .isString()
    .withMessage('Currency must be a string')
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter code'),
  
  body('narration')
    .optional()
    .isString()
    .withMessage('Narration must be a string')
    .isLength({ max: 100 })
    .withMessage('Narration must not exceed 100 characters'),
  
  body('reference')
    .optional()
    .isString()
    .withMessage('Reference must be a string'),
  
  body('debit_currency')
    .optional()
    .isString()
    .withMessage('Debit currency must be a string')
    .isLength({ min: 3, max: 3 })
    .withMessage('Debit currency must be a 3-letter code'),
  
  handleValidationErrors
];

/**
 * Validate account verification request
 */
const validateAccountVerification = [
  body('account_number')
    .notEmpty()
    .withMessage('Account number is required')
    .isString()
    .withMessage('Account number must be a string')
    .isLength({ min: 10, max: 10 })
    .withMessage('Account number must be 10 digits'),
  
  body('account_bank')
    .notEmpty()
    .withMessage('Bank code is required')
    .isString()
    .withMessage('Bank code must be a string'),
  
  handleValidationErrors
];

module.exports = {
  validateWithdrawal,
  validateAccountVerification
};

