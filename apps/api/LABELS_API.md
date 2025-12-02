# 📡 Labels API Endpoints Reference

## 🎯 Quick Reference

| Method | Endpoint | Description | Auth | Permission |
|--------|----------|-------------|------|------------|
| `GET` | `/boards/:id/labels` | List labels | JWT | Board member |
| `POST` | `/boards/:id/labels` | Create label | JWT | Board member |
| `PATCH` | `/labels/:id` | Update label | JWT | Board member |
| `DELETE` | `/labels/:id` | Delete label | JWT | Board member |
| `POST` | `/cards/:id/labels` | Assign label | JWT | Board member |
| `DELETE` | `/cards/:id/labels/:labelId` | Remove label | JWT | Board member |

---

## 📋 Detailed Endpoint Specifications

### 1️⃣ GET /boards/:id/labels

**Description**: Retrieve all labels for a specific board.

**URL Parameters**:
- `id` (string, required): Board ID

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
[
  {
    "id": "clxxx...",
    "boardId": "clyyy...",
    "name": "Urgent",
    "color": "#FF0000",
    "createdAt": "2025-11-26T10:00:00.000Z",
    "updatedAt": "2025-11-26T10:00:00.000Z"
  },
  {
    "id": "clzzz...",
    "boardId": "clyyy...",
    "name": "En cours",
    "color": "#0000FF",
    "createdAt": "2025-11-26T10:05:00.000Z",
    "updatedAt": "2025-11-26T10:05:00.000Z"
  }
]
```

**Error Responses**:
- **403 Forbidden**: Not a board member
```json
{
  "statusCode": 403,
  "message": "You are not a member of this board"
}
```

---

### 2️⃣ POST /boards/:id/labels

**Description**: Create a new label on a board.

**URL Parameters**:
- `id` (string, required): Board ID

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Urgent",
  "color": "#FF0000"
}
```

**Validation Rules**:
- `name`: required, non-empty string
- `color`: required, hex color format `#RRGGBB`

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "id": "clxxx...",
  "boardId": "clyyy...",
  "name": "Urgent",
  "color": "#FF0000",
  "createdAt": "2025-11-26T10:00:00.000Z",
  "updatedAt": "2025-11-26T10:00:00.000Z"
}
```

**Error Responses**:
- **400 Bad Request**: Invalid color format
```json
{
  "statusCode": 400,
  "message": ["color must be a valid hex color (e.g., #FF0000)"],
  "error": "Bad Request"
}
```

- **403 Forbidden**: Not a board member

---

### 3️⃣ PATCH /labels/:id

**Description**: Update a label's name and/or color.

**URL Parameters**:
- `id` (string, required): Label ID

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "name": "Très Urgent",
  "color": "#FF6600"
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "id": "clxxx...",
  "boardId": "clyyy...",
  "name": "Très Urgent",
  "color": "#FF6600",
  "createdAt": "2025-11-26T10:00:00.000Z",
  "updatedAt": "2025-11-26T10:30:00.000Z"
}
```

**Error Responses**:
- **404 Not Found**: Label doesn't exist
- **403 Forbidden**: Not a member of the label's board

---

### 4️⃣ DELETE /labels/:id

**Description**: Delete a label. All card assignments are automatically removed (cascade).

**URL Parameters**:
- `id` (string, required): Label ID

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Label deleted successfully"
}
```

**Error Responses**:
- **404 Not Found**: Label doesn't exist
- **403 Forbidden**: Not a member of the label's board

---

### 5️⃣ POST /cards/:id/labels

**Description**: Assign a label to a card. Label must belong to the same board as the card.

**URL Parameters**:
- `id` (string, required): Card ID

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:
```json
{
  "labelId": "clxxx..."
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "message": "Label assigned successfully"
}
```

**Already Assigned Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Label already assigned to this card"
}
```

**Error Responses**:
- **404 Not Found**: Card or label not found
```json
{
  "statusCode": 404,
  "message": "Card not found"
}
```

- **403 Forbidden**: Label from different board
```json
{
  "statusCode": 403,
  "message": "Label does not belong to the same board as the card"
}
```

- **403 Forbidden**: Not a member of the card's board

---

### 6️⃣ DELETE /cards/:id/labels/:labelId

**Description**: Remove a label assignment from a card.

**URL Parameters**:
- `id` (string, required): Card ID
- `labelId` (string, required): Label ID

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Label removed successfully"
}
```

**Error Responses**:
- **404 Not Found**: Card not found or label not assigned
```json
{
  "statusCode": 404,
  "message": "Label is not assigned to this card"
}
```

- **403 Forbidden**: Not a member of the card's board

---

## 🔐 Authentication & Authorization

All endpoints require:
1. **JWT Token** in `Authorization: Bearer <token>` header
2. **Board Membership** - User must be a member of the board (via `BoardMember` table)

### Permission Flow:
```
User Request → JWT Guard → Extract userId
            ↓
Check BoardMember table
            ↓
If not member → 403 Forbidden
If member → Process request
```

---

## 🎨 Color Format

Labels use **hex color codes**:
- Format: `#RRGGBB`
- Examples: `#FF0000` (red), `#00FF00` (green), `#0000FF` (blue)
- Invalid: `red`, `#F00`, `rgb(255,0,0)`

---

## 🔗 Data Relationships

```
Board (1) ──────< (N) Label
                        │
                        │
Card (N) ────────< CardLabel >────── (N) Label
         many-to-many
```

**Cascade Delete Behavior**:
- Delete Board → All Labels deleted → All CardLabels deleted
- Delete Label → All CardLabels deleted
- Delete Card → All CardLabels deleted

---

## 📊 Common HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| `200` | OK | GET/PATCH/DELETE success |
| `201` | Created | POST success |
| `400` | Bad Request | Validation error |
| `401` | Unauthorized | Missing/invalid JWT |
| `403` | Forbidden | Not a board member |
| `404` | Not Found | Resource doesn't exist |

---

## 🧪 Testing with curl

### Complete Workflow Example:

```bash
# 1. Create a label
LABEL=$(curl -X POST http://localhost:3000/boards/$BOARD_ID/labels \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Bug", "color": "#FF0000"}')

LABEL_ID=$(echo $LABEL | jq -r '.id')

# 2. Assign to card
curl -X POST http://localhost:3000/cards/$CARD_ID/labels \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"labelId\": \"$LABEL_ID\"}"

# 3. Update color
curl -X PATCH http://localhost:3000/labels/$LABEL_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"color": "#FF6600"}'

# 4. List all labels
curl -X GET http://localhost:3000/boards/$BOARD_ID/labels \
  -H "Authorization: Bearer $TOKEN"

# 5. Remove from card
curl -X DELETE http://localhost:3000/cards/$CARD_ID/labels/$LABEL_ID \
  -H "Authorization: Bearer $TOKEN"

# 6. Delete label
curl -X DELETE http://localhost:3000/labels/$LABEL_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

**Base URL**: `http://localhost:3000` (development)  
**API Version**: v1  
**Last Updated**: November 2025
