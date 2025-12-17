const flutterwaveService = require('../services/flutterwave.service');
const { generateReference } = require('../utils/helpers');

/**
 * Initiate a withdrawal
 */
const initiateWithdrawal = async (req, res, next) => {
  try {
    const {
      account_bank,
      account_number,
      amount,
      currency,
      narration,
      debit_currency
    } = req.body;

    // Generate unique reference if not provided
    const reference = req.body.reference || generateReference();

    const withdrawalData = {
      account_bank,
      account_number,
      amount: parseFloat(amount),
      currency: currency || 'NGN',
      narration: narration || 'Withdrawal',
      reference,
      debit_currency: debit_currency || 'NGN'
    };

    const result = await flutterwaveService.initiateTransfer(withdrawalData);

    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        status: 'error',
        message: 'Withdrawal initiation failed',
        error: result.error
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Withdrawal initiated successfully',
      data: {
        reference: result.data.data.reference,
        amount: result.data.data.amount,
        currency: result.data.data.currency,
        status: result.data.data.status,
        created_at: result.data.data.created_at,
        complete_message: result.data.data.complete_message
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get withdrawal status by reference
 */
const getWithdrawalStatus = async (req, res, next) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        status: 'error',
        message: 'Reference is required'
      });
    }

    const result = await flutterwaveService.getTransferStatus(reference);

    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        status: 'error',
        message: 'Failed to fetch withdrawal status',
        error: result.error
      });
    }

    res.status(200).json({
      status: 'success',
      data: result.data.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all withdrawals with optional filters
 */
const getAllWithdrawals = async (req, res, next) => {
  try {
    const {
      page,
      per_page,
      status,
      currency,
      date_from,
      date_to
    } = req.query;

    const filters = {};
    if (page) filters.page = page;
    if (per_page) filters.per_page = per_page;
    if (status) filters.status = status;
    if (currency) filters.currency = currency;
    if (date_from) filters.date_from = date_from;
    if (date_to) filters.date_to = date_to;

    const result = await flutterwaveService.getAllTransfers(filters);

    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        status: 'error',
        message: 'Failed to fetch withdrawals',
        error: result.error
      });
    }

    res.status(200).json({
      status: 'success',
      data: result.data.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get list of banks with their codes
 */
const getBanks = async (req, res, next) => {
  try {
    const { country } = req.query;
    const countryCode = country || 'NG';

    const result = await flutterwaveService.getBanks(countryCode);

    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        status: 'error',
        message: 'Failed to fetch banks',
        error: result.error
      });
    }

    // Format banks data to show name and code clearly
    const banks = result.data.data || [];
    const formattedBanks = banks.map(bank => ({
      id: bank.id,
      name: bank.name,
      code: bank.code,
      country: bank.country || countryCode
    }));

    res.status(200).json({
      status: 'success',
      message: `Retrieved ${formattedBanks.length} banks`,
      country: countryCode,
      data: formattedBanks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify bank account
 */
const verifyAccount = async (req, res, next) => {
  try {
    const { account_number, account_bank } = req.body;

    if (!account_number || !account_bank) {
      return res.status(400).json({
        status: 'error',
        message: 'Account number and bank code are required'
      });
    }

    const result = await flutterwaveService.verifyAccount(account_number, account_bank);

    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        status: 'error',
        message: 'Account verification failed',
        error: result.error
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Account verified successfully',
      data: result.data.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get transfer fee
 */
const getTransferFee = async (req, res, next) => {
  try {
    const { amount, currency, type } = req.query;

    if (!amount) {
      return res.status(400).json({
        status: 'error',
        message: 'Amount is required'
      });
    }

    const result = await flutterwaveService.getTransferFee(
      parseFloat(amount),
      currency || 'NGN',
      type || 'account'
    );

    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        status: 'error',
        message: 'Failed to fetch transfer fee',
        error: result.error
      });
    }

    res.status(200).json({
      status: 'success',
      data: result.data.data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initiateWithdrawal,
  getWithdrawalStatus,
  getAllWithdrawals,
  getBanks,
  verifyAccount,
  getTransferFee
};

