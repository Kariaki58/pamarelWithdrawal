const axios = require('axios');

class FlutterwaveService {
  constructor() {
    this.baseURL = process.env.FLW_BASE_URL || 'https://api.flutterwave.com/v3';
    this.secretKey = process.env.FLW_SECRET_KEY;
    this.publicKey = process.env.FLW_PUBLIC_KEY;

    if (!this.secretKey || !this.publicKey) {
      throw new Error('Flutterwave API keys are required. Please set FLW_SECRET_KEY and FLW_PUBLIC_KEY in your .env file');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Initiate a bank transfer withdrawal
   * @param {Object} withdrawalData - Withdrawal details
   * @param {string} withdrawalData.account_bank - Bank code
   * @param {string} withdrawalData.account_number - Account number
   * @param {number} withdrawalData.amount - Amount to withdraw
   * @param {string} withdrawalData.currency - Currency code (default: NGN)
   * @param {string} withdrawalData.narration - Transaction narration
   * @param {string} withdrawalData.reference - Unique transaction reference
   * @param {string} withdrawalData.debit_currency - Currency to debit from (default: NGN)
   * @returns {Promise<Object>} Flutterwave API response
   */
  async initiateTransfer(withdrawalData) {
    try {
      const payload = {
        account_bank: withdrawalData.account_bank,
        account_number: withdrawalData.account_number,
        amount: withdrawalData.amount,
        currency: withdrawalData.currency || 'NGN',
        narration: withdrawalData.narration || 'Withdrawal',
        reference: withdrawalData.reference,
        debit_currency: withdrawalData.debit_currency || 'NGN'
      };

      const response = await this.client.post('/transfers', payload);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        statusCode: error.response?.status || 500
      };
    }
  }

  /**
   * Get transfer status by reference
   * @param {string} reference - Transaction reference
   * @returns {Promise<Object>} Transfer status
   */
  async getTransferStatus(reference) {
    try {
      const response = await this.client.get(`/transfers/${reference}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        statusCode: error.response?.status || 500
      };
    }
  }

  /**
   * Get all transfers with optional filters
   * @param {Object} filters - Query filters
   * @returns {Promise<Object>} List of transfers
   */
  async getAllTransfers(filters = {}) {
    try {
      const response = await this.client.get('/transfers', { params: filters });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        statusCode: error.response?.status || 500
      };
    }
  }

  /**
   * Get bank list for a country
   * @param {string} country - Country code (default: NG)
   * @returns {Promise<Object>} List of banks
   */
  async getBanks(country = 'NG') {
    try {
      const response = await this.client.get(`/banks/${country}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        statusCode: error.response?.status || 500
      };
    }
  }

  /**
   * Verify bank account number
   * @param {string} accountNumber - Account number to verify
   * @param {string} bankCode - Bank code
   * @returns {Promise<Object>} Account verification result
   */
  async verifyAccount(accountNumber, bankCode) {
    try {
      const response = await this.client.post('/accounts/resolve', {
        account_number: accountNumber,
        account_bank: bankCode
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        statusCode: error.response?.status || 500
      };
    }
  }

  /**
   * Get transfer fee
   * @param {number} amount - Transfer amount
   * @param {string} currency - Currency code
   * @param {string} type - Transfer type
   * @returns {Promise<Object>} Transfer fee information
   */
  async getTransferFee(amount, currency = 'NGN', type = 'account') {
    try {
      const response = await this.client.post('/transfers/fee', {
        amount,
        currency,
        type
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        statusCode: error.response?.status || 500
      };
    }
  }
}

module.exports = new FlutterwaveService();

