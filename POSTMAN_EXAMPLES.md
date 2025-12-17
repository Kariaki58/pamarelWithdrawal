# Postman API Request Examples

## Setup Instructions

1. **Base URL**: `http://localhost:3000`
2. **API Key**: Add your API key to all requests in the headers
   - Header name: `X-API-Key`
   - Header value: `e91ddfce90e4abe4cf848bae1c0867b858f8b7ea0a0d693f199c17a36a3cd87b`

---

## 1. Health Check (No Authentication Required)

**Method**: `GET`  
**URL**: `http://localhost:3000/health`

**Headers**: None required

**Expected Response**:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 2. Get List of Banks

**Method**: `GET`  
**URL**: `http://localhost:3000/api/withdrawals/banks?country=NG`

**Headers**:
```
X-API-Key: e91ddfce90e4abe4cf848bae1c0867b858f8b7ea0a0d693f199c17a36a3cd87b
```

**Query Parameters** (optional):
- `country`: `NG` (default)

**Expected Response**:
```json
{
  "status": "success",
  "data": [
    {
      "id": 44,
      "code": "044",
      "name": "Access Bank"
    },
    ...
  ]
}
```

---

## 3. Verify Bank Account

**Method**: `POST`  
**URL**: `http://localhost:3000/api/withdrawals/verify-account`

**Headers**:
```
Content-Type: application/json
X-API-Key: e91ddfce90e4abe4cf848bae1c0867b858f8b7ea0a0d693f199c17a36a3cd87b
```

**Body** (raw JSON):
```json
{
  "account_number": "1234567890",
  "account_bank": "044"
}
```

**Expected Response**:
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

---

## 4. Get Transfer Fee

**Method**: `GET`  
**URL**: `http://localhost:3000/api/withdrawals/fee?amount=1000&currency=NGN&type=account`

**Headers**:
```
X-API-Key: e91ddfce90e4abe4cf848bae1c0867b858f8b7ea0a0d693f199c17a36a3cd87b
```

**Query Parameters**:
- `amount`: `1000` (required)
- `currency`: `NGN` (optional, default: NGN)
- `type`: `account` (optional, default: account)

**Expected Response**:
```json
{
  "status": "success",
  "data": {
    "currency": "NGN",
    "fee_type": "FLAT",
    "fee": 10
  }
}
```

---

## 5. Initiate Withdrawal (Most Important)

**Method**: `POST`  
**URL**: `http://localhost:3000/api/withdrawals`

**Headers**:
```
Content-Type: application/json
X-API-Key: e91ddfce90e4abe4cf848bae1c0867b858f8b7ea0a0d693f199c17a36a3cd87b
```

**Body** (raw JSON):
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

**Body Fields**:
- `account_bank`: Bank code (3 digits, e.g., "044" for Access Bank) - **Required**
- `account_number`: 10-digit account number - **Required**
- `amount`: Amount to withdraw (number) - **Required**
- `currency`: Currency code (default: "NGN") - **Optional**
- `narration`: Transaction description - **Optional**
- `debit_currency`: Currency to debit from (default: "NGN") - **Optional**
- `reference`: Custom reference (auto-generated if not provided) - **Optional**

**Expected Response**:
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

---

## 6. Get Withdrawal Status

**Method**: `GET`  
**URL**: `http://localhost:3000/api/withdrawals/status/WTH-1234567890-1234`

**Headers**:
```
X-API-Key: e91ddfce90e4abe4cf848bae1c0867b858f8b7ea0a0d693f199c17a36a3cd87b
```

**Note**: Replace `WTH-1234567890-1234` with the actual reference from your withdrawal response.

**Expected Response**:
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

---

## 7. Get All Withdrawals

**Method**: `GET`  
**URL**: `http://localhost:3000/api/withdrawals?page=1&per_page=20&status=SUCCESSFUL`

**Headers**:
```
X-API-Key: e91ddfce90e4abe4cf848bae1c0867b858f8b7ea0a0d693f199c17a36a3cd87b
```

**Query Parameters** (all optional):
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 50)
- `status`: Filter by status (`NEW`, `PENDING`, `SUCCESSFUL`, `FAILED`)
- `currency`: Filter by currency code
- `date_from`: Start date (format: `YYYY-MM-DD`)
- `date_to`: End date (format: `YYYY-MM-DD`)

**Example URLs**:
- Get all: `http://localhost:3000/api/withdrawals`
- Filter by status: `http://localhost:3000/api/withdrawals?status=SUCCESSFUL`
- With pagination: `http://localhost:3000/api/withdrawals?page=1&per_page=20`
- Date range: `http://localhost:3000/api/withdrawals?date_from=2024-01-01&date_to=2024-01-31`

**Expected Response**:
```json
{
  "status": "success",
  "data": {
    "status": "success",
    "message": "Transfers retrieved",
    "data": [
      {
        "id": 12345,
        "account_number": "1234567890",
        "bank_code": "044",
        "full_name": "John Doe",
        "amount": 1000,
        "currency": "NGN",
        "status": "SUCCESSFUL",
        "reference": "WTH-1234567890-1234",
        ...
      }
    ],
    "meta": {
      "page_info": {
        "total": 100,
        "current_page": 1,
        "total_pages": 5
      }
    }
  }
}
```

---

## Postman Collection Setup Tips

### Setting Up Environment Variables in Postman

1. Create a new Environment in Postman:
   - Click "Environments" → "Create Environment"
   - Add variables:
     - `base_url`: `http://localhost:3000`
     - `api_key`: `e91ddfce90e4abe4cf848bae1c0867b858f8b7ea0a0d693f199c17a36a3cd87b`

2. Use variables in requests:
   - URL: `{{base_url}}/api/withdrawals`
   - Header: `X-API-Key: {{api_key}}`

### Common Nigerian Bank Codes

- Access Bank: `044`
- GTBank: `058`
- First Bank: `011`
- UBA: `033`
- Zenith Bank: `057`
- Fidelity Bank: `070`
- Stanbic IBTC: `221`
- Union Bank: `032`

---

## Error Responses

### 401 Unauthorized (Missing API Key)
```json
{
  "status": "error",
  "message": "API key is required. Please provide it in the X-API-Key header or Authorization header."
}
```

### 403 Forbidden (Invalid API Key)
```json
{
  "status": "error",
  "message": "Invalid API key"
}
```

### 400 Bad Request (Validation Error)
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Account number is required",
      "param": "account_number",
      "location": "body"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Withdrawal initiation failed",
  "error": {
    "message": "Detailed error from Flutterwave API"
  }
}
```

