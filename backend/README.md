# API

`POST`

- /api/register

```json
{
  "walletAddress": "0x1234567890",
  "amount": 100,
  "details": "some details",
  "callBackUrl": "https://example.com/callback",
  "apiKey": "c4555bb28d512410cbc49106dc4889e95894111e8d015903035fa2b6857cea5aacdbd5d0dbed5a4fefc9cfb5dfa1757050fbde5c76900f3ed174bf137858ed86"
}
```

`GET`

- /api/login

  To be queried using :

  1. walletAddress : while user connects wallet
  2. apiKey : while fetching details for payment page
  3. walletAddress or apiKey : While user goes to DashBoard page

```json
{
  "user": {
    "walletAddress": "0x1234567890",
    "apiKey": "c4555bb28d512410cbc49106dc4889e95894111e8d015903035fa2b6857cea5aacdbd5d0dbed5a4fefc9cfb5dfa1757050fbde5c76900f3ed174bf137858ed86",
    "totalUsers": 10,
    "totalTransaactions": 10,
    "totalAmount": 50,
    "details": "some details",
    "amount": 10,
    "transactions": [],
    "subscribers": [],
    "callBackUrl": "https://example.com/callback"
  },
  "exists": true
}
```
