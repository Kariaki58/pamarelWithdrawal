/**
 * Generate unique transaction reference
 * Format: WTH-{timestamp}-{random}
 */
const generateReference = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `WTH-${timestamp}-${random}`;
};

/**
 * Format currency amount
 */
const formatAmount = (amount, currency = 'NGN') => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Validate bank account number format
 */
const validateAccountNumber = (accountNumber) => {
  return /^\d{10}$/.test(accountNumber);
};

/**
 * Validate bank code format
 */
const validateBankCode = (bankCode) => {
  return /^\d{3}$/.test(bankCode);
};

module.exports = {
  generateReference,
  formatAmount,
  validateAccountNumber,
  validateBankCode
};

