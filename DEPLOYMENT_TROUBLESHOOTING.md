# Deployment Troubleshooting

## Testing Your Deployed API

### 1. Test Health Endpoint (No Auth Required)
```bash
curl https://pamarelwithdrawal.onrender.com/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test Banks Endpoint (Auth Required)

**With cURL:**
```bash
curl -X GET "https://pamarelwithdrawal.onrender.com/api/withdrawals/banks?country=NG" \
  -H "X-API-Key: your_api_key_here"
```

**With Browser/Postman:**
- URL: `https://pamarelwithdrawal.onrender.com/api/withdrawals/banks?country=NG`
- Headers: 
  - `X-API-Key: your_api_key_here`
  - OR `Authorization: Bearer your_api_key_here`

## Common Issues

### 404 Not Found
- **Check**: Is the server running? Test `/health` endpoint first
- **Check**: Are you including the API key in headers?
- **Check**: Is the route path correct? Should be `/api/withdrawals/banks`

### 401 Unauthorized
- **Solution**: Add `X-API-Key` header with your API key
- **Solution**: Make sure `API_KEY` is set in your Render environment variables

### 500 Server Error
- **Check**: Are Flutterwave API keys set in environment variables?
- **Check**: Is `API_KEY` set in production environment?

## Render Environment Variables Checklist

Make sure these are set in your Render dashboard:

```
PORT=10000 (or whatever Render assigns)
NODE_ENV=production
FLW_PUBLIC_KEY=your_flutterwave_public_key
FLW_SECRET_KEY=your_flutterwave_secret_key
FLW_BASE_URL=https://api.flutterwave.com/v3
API_KEY=your_api_key_here
```

## Making Banks Endpoint Public (Optional)

If you want the banks endpoint to be accessible without authentication, we can modify the routes to exclude it from authentication.







