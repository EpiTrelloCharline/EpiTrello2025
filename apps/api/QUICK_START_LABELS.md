# 🚀 Quick Start - Labels Feature

## ⚡ 5-Minute Setup

### 1️⃣ Install & Build
```bash
cd apps/api
npm install
npx prisma generate
npm run build
```

### 2️⃣ Start the API
```bash
npm run start:dev
```

### 3️⃣ Configure Test Environment
```bash
# Copy the example file
cp .env.test.example .env.test

# Edit .env.test and add your values:
# TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# BOARD_ID=clxxx...
# CARD_ID=clyyy...
```

### 4️⃣ Run Automated Tests
```bash
./test-labels.sh
```

---

## 🎯 Manual Test (Quick)

### Get Your Token
```bash
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}' \
  | jq -r '.access_token')

echo $TOKEN
```

### Create Your First Label
```bash
curl -X POST http://localhost:3000/boards/YOUR_BOARD_ID/labels \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Urgent", "color": "#FF0000"}'
```

### List Labels
```bash
curl -X GET http://localhost:3000/boards/YOUR_BOARD_ID/labels \
  -H "Authorization: Bearer $TOKEN"
```

### 🎉 Done!

---

## 🆘 Troubleshooting

### "403 Forbidden"
→ You are not a member of the board. Check `BoardMember` table.

### "400 Bad Request - color must be valid hex"
→ Use format `#RRGGBB` (e.g., `#FF0000`)

### "Label not found"
→ Check the label ID and ensure it belongs to the correct board.

### Migration not applied
```bash
npx prisma migrate deploy
```

---

## 🎮 Postman Collection

Import this JSON into Postman for easy testing:

```json
{
  "info": {
    "name": "EpiTrello Labels API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {"key": "baseUrl", "value": "http://localhost:3000"},
    {"key": "token", "value": "YOUR_JWT_TOKEN"},
    {"key": "boardId", "value": "YOUR_BOARD_ID"},
    {"key": "cardId", "value": "YOUR_CARD_ID"},
    {"key": "labelId", "value": ""}
  ],
  "item": [
    {
      "name": "Get Labels",
      "request": {
        "method": "GET",
        "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
        "url": "{{baseUrl}}/boards/{{boardId}}/labels"
      }
    },
    {
      "name": "Create Label",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"},
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"Urgent\", \"color\": \"#FF0000\"}"
        },
        "url": "{{baseUrl}}/boards/{{boardId}}/labels"
      }
    },
    {
      "name": "Update Label",
      "request": {
        "method": "PATCH",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"},
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"Très Urgent\", \"color\": \"#FF6600\"}"
        },
        "url": "{{baseUrl}}/labels/{{labelId}}"
      }
    },
    {
      "name": "Delete Label",
      "request": {
        "method": "DELETE",
        "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
        "url": "{{baseUrl}}/labels/{{labelId}}"
      }
    },
    {
      "name": "Assign Label to Card",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"},
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"labelId\": \"{{labelId}}\"}"
        },
        "url": "{{baseUrl}}/cards/{{cardId}}/labels"
      }
    },
    {
      "name": "Remove Label from Card",
      "request": {
        "method": "DELETE",
        "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
        "url": "{{baseUrl}}/cards/{{cardId}}/labels/{{labelId}}"
      }
    }
  ]
}
```

Save as `labels-api.postman_collection.json` and import into Postman.
