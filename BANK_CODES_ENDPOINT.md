# Get Banks and Bank Codes Endpoint

## Endpoint

**GET** `/api/withdrawals/banks`

Get a list of all banks with their codes for a specific country.

## Authentication

Requires API key in headers:
- `X-API-Key: your_api_key_here`
- OR `Authorization: Bearer your_api_key_here`

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `country` | string | No | `NG` | Country code (e.g., `NG` for Nigeria, `GH` for Ghana, `KE` for Kenya) |

## Request Examples

### Get Nigerian Banks (Default)
```bash
GET http://localhost:3000/api/withdrawals/banks
X-API-Key: your_api_key_here
```

### Get Banks for Specific Country
```bash
GET http://localhost:3000/api/withdrawals/banks?country=GH
X-API-Key: your_api_key_here
```

### cURL Example
```bash
curl -X GET "http://localhost:3000/api/withdrawals/banks?country=NG" \
  -H "X-API-Key: your_api_key_here"
```

### JavaScript/Fetch Example
```javascript
fetch('http://localhost:3000/api/withdrawals/banks?country=NG', {
  method: 'GET',
  headers: {
    'X-API-Key': 'your_api_key_here'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

## Response Format

### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Retrieved 45 banks",
  "country": "NG",
  "data": [
    {
      "id": 44,
      "name": "Access Bank",
      "code": "044",
      "country": "NG"
    },
    {
      "id": 63,
      "name": "Access Bank (Diamond)",
      "code": "063",
      "country": "NG"
    },
    {
      "id": 50,
      "name": "Ecobank Nigeria",
      "code": "050",
      "country": "NG"
    },
    {
      "id": 11,
      "name": "First Bank of Nigeria",
      "code": "011",
      "country": "NG"
    },
    {
      "id": 58,
      "name": "Guaranty Trust Bank",
      "code": "058",
      "country": "NG"
    },
    {
      "id": 33,
      "name": "United Bank For Africa",
      "code": "033",
      "country": "NG"
    },
    {
      "id": 57,
      "name": "Zenith Bank",
      "code": "057",
      "country": "NG"
    }
    // ... more banks
  ]
}
```

### Error Response (500)
```json
{
  "status": "error",
  "message": "Failed to fetch banks",
  "error": {
    "message": "Error details from Flutterwave API"
  }
}
```

## Response Fields

Each bank object contains:
- `id` - Flutterwave bank ID
- `name` - Bank name
- `code` - Bank code (3-digit code used in withdrawal requests)
- `country` - Country code

## Usage in Withdrawal

When initiating a withdrawal, use the `code` field as the `account_bank` parameter:

```json
{
  "account_bank": "044",  // Use the code from the banks list
  "account_number": "1234567890",
  "amount": 1000.00
}
```

## Supported Countries

Flutterwave supports banks from multiple countries. Common country codes:
- `NG` - Nigeria
- `GH` - Ghana
- `KE` - Kenya
- `UG` - Uganda
- `TZ` - Tanzania
- `ZA` - South Africa
- `RW` - Rwanda

## Notes

- The endpoint returns all banks supported by Flutterwave for the specified country
- Bank codes are unique 3-digit identifiers
- Always use the `code` field (not `id`) when making withdrawal requests
- The list may be updated by Flutterwave, so it's recommended to fetch it periodically or cache it









