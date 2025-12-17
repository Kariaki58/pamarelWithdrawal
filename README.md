# Flutterwave Withdrawal System

A robust Express.js backend system for handling Flutterwave bank transfer withdrawals with comprehensive API endpoints, validation, and error handling.

## Features

- ✅ Initiate bank transfer withdrawals
- ✅ Check withdrawal status
- ✅ List all withdrawals with filtering
- ✅ Bank account verification
- ✅ Get list of supported banks
- ✅ Calculate transfer fees
- ✅ Request validation
- ✅ API key authentication
- ✅ Comprehensive error handling
- ✅ Security middleware (Helmet, CORS)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Flutterwave account with API keys

## Installation

1. Clone the repository and navigate to the project directory:
```bash
cd pamarelWithdrawal
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
PORT=3000
NODE_ENV=development

# Flutterwave API Configuration
FLW_PUBLIC_KEY=your_flutterwave_public_key
FLW_SECRET_KEY=your_flutterwave_secret_key
FLW_BASE_URL=https://api.flutterwave.com/v3

# Security
API_KEY=your_api_key_here
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Base URL
```
http://localhost:3000/api/withdrawals
```

### Authentication
All endpoints require authentication via API key. Include it in your request headers:
```
X-API-Key: your_api_key_here
```
or
```
Authorization: Bearer your_api_key_here
```

### Endpoints

#### 1. Initiate Withdrawal
**POST** `/api/withdrawals`

Initiate a bank transfer withdrawal.

**Request Body:**
```json
{
  "account_bank": "044",
  "account_number": "1234567890",
  "amount": 1000.00,
  "currency": "NGN",
  "narration": "Payment for services",
  "debit_currency": "NGN"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Withdrawal initiated successfully",
  "data": {
    "reference": "WTH-1234567890-1234",
    "amount": 1000,
    "currency": "NGN",
    "status": "NEW",
    "created_at": "2024-01-01T00:00:00.000Z",
    "complete_message": "Transfer queued"
  }
}
```

#### 2. Get Withdrawal Status
**GET** `/api/withdrawals/status/:reference`

Get the status of a withdrawal by reference.

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 12345,
    "account_number": "1234567890",
    "bank_code": "044",
    "full_name": "John Doe",
    "created_at": "2024-01-01T00:00:00.000Z",
    "currency": "NGN",
    "debit_currency": "NGN",
    "amount": 1000,
    "fee": 10,
    "status": "SUCCESSFUL",
    "reference": "WTH-1234567890-1234",
    "narration": "Payment for services",
    "complete_message": "Transfer completed"
  }
}
```

#### 3. Get All Withdrawals
**GET** `/api/withdrawals`

Get all withdrawals with optional filters.

**Query Parameters:**
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 50)
- `status` - Filter by status (NEW, PENDING, SUCCESSFUL, FAILED)
- `currency` - Filter by currency
- `date_from` - Start date (YYYY-MM-DD)
- `date_to` - End date (YYYY-MM-DD)

**Example:**
```
GET /api/withdrawals?status=SUCCESSFUL&page=1&per_page=20
```

#### 4. Get Banks
**GET** `/api/withdrawals/banks`

Get list of supported banks.

**Query Parameters:**
- `country` - Country code (default: NG)

**Example:**
```
GET /api/withdrawals/banks?country=NG
```

#### 5. Verify Bank Account
**POST** `/api/withdrawals/verify-account`

Verify a bank account number before initiating withdrawal.

**Request Body:**
```json
{
  "account_number": "1234567890",
  "account_bank": "044"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Account verified successfully",
  "data": {
    "account_number": "1234567890",
    "account_name": "John Doe",
    "bank_id": 44
  }
}
```

#### 6. Get Transfer Fee
**GET** `/api/withdrawals/fee`

Get the fee for a transfer amount.

**Query Parameters:**
- `amount` - Transfer amount (required)
- `currency` - Currency code (default: NGN)
- `type` - Transfer type (default: account)

**Example:**
```
GET /api/withdrawals/fee?amount=1000&currency=NGN
```

#### 7. Health Check
**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Handling

The API returns standardized error responses:

```json
{
  "status": "error",
  "message": "Error description",
  "error": {
    "message": "Detailed error message"
  }
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid API key)
- `403` - Forbidden (invalid API key)
- `404` - Not Found (route not found)
- `500` - Internal Server Error

## Project Structure

```
pamarelWithdrawal/
├── controllers/
│   └── withdrawal.controller.js    # Request handlers
├── middleware/
│   ├── auth.js                     # Authentication middleware
│   ├── errorHandler.js             # Global error handler
│   └── validation.js               # Request validation
├── routes/
│   └── withdrawal.routes.js        # API routes
├── services/
│   └── flutterwave.service.js      # Flutterwave API integration
├── utils/
│   └── helpers.js                  # Utility functions
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore file
├── package.json                    # Dependencies
├── README.md                       # Documentation
└── server.js                       # Application entry point
```

## Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configures Cross-Origin Resource Sharing
- **API Key Authentication**: Protects all endpoints
- **Input Validation**: Validates all incoming requests
- **Error Handling**: Prevents information leakage

## Testing with cURL

### Initiate Withdrawal
```bash
curl -X POST http://localhost:3000/api/withdrawals \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "account_bank": "044",
    "account_number": "1234567890",
    "amount": 1000,
    "currency": "NGN",
    "narration": "Test withdrawal"
  }'
```

### Check Status
```bash
curl -X GET http://localhost:3000/api/withdrawals/status/WTH-1234567890-1234 \
  -H "X-API-Key: your_api_key_here"
```

### Verify Account
```bash
curl -X POST http://localhost:3000/api/withdrawals/verify-account \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "account_number": "1234567890",
    "account_bank": "044"
  }'
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment (development/production) | No |
| `FLW_PUBLIC_KEY` | Flutterwave public key | Yes |
| `FLW_SECRET_KEY` | Flutterwave secret key | Yes |
| `FLW_BASE_URL` | Flutterwave API base URL | No (default: https://api.flutterwave.com/v3) |
| `API_KEY` | API key for authentication | Yes (for production) |

## Notes

- All amounts should be in the smallest currency unit (e.g., kobo for NGN)
- Bank codes are 3-digit codes provided by Flutterwave
- Account numbers must be 10 digits for Nigerian banks
- Always verify account details before initiating withdrawals
- Check withdrawal status after initiation to confirm completion

## License

ISC

## Support

For issues related to:
- **Flutterwave API**: Check [Flutterwave Documentation](https://developer.flutterwave.com/docs)
- **This Project**: Open an issue in the repository

