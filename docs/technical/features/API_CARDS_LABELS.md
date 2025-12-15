# API Documentation: Cards & Labels

Base URL: `http://localhost:3001` (Development)

## Authentication
All endpoints require a valid Bearer Token in the Authorization header:
`Authorization: Bearer <your_jwt_token>`

---

## Cards API

### 1. List Cards
Get all cards in a specific list.

- **URL**: `/cards`
- **Method**: `GET`
- **Query Params**:
  - `listId` (required): The ID of the list.

**Response (200 OK):**
```json
[
  {
    "id": "card-123",
    "title": "My Card",
    "description": "Card description",
    "position": 1,
    "listId": "list-abc",
    "isArchived": false,
    "createdAt": "2023-10-27T10:00:00.000Z",
    "updatedAt": "2023-10-27T10:00:00.000Z",
    "labels": [],
    "members": []
  }
]
```

### 2. Create Card
Create a new card in a list.

- **URL**: `/cards`
- **Method**: `POST`
- **Body**:
```json
{
  "title": "New Task",
  "listId": "list-abc",
  "description": "Optional description"
}
```

**Response (201 Created):**
```json
{
  "id": "card-456",
  "title": "New Task",
  "description": "Optional description",
  "position": 2,
  "listId": "list-abc",
  "isArchived": false,
  "createdAt": "2023-10-27T10:05:00.000Z",
  "updatedAt": "2023-10-27T10:05:00.000Z",
  "labels": [],
  "members": []
}
```

### 3. Move Card
Move a card to a different position or list.

- **URL**: `/cards/move`
- **Method**: `POST`
- **Body**:
```json
{
  "cardId": "card-456",
  "listId": "list-xyz",
  "newPosition": 1
}
```

**Response (200 OK):**
```json
{
  "id": "card-456",
  "listId": "list-xyz",
  "position": 1,
}
```

### 4. Update Card
Update card details (title, description, etc.).

- **URL**: `/cards/:id`
- **Method**: `PATCH`
- **Body** (all fields optional):
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "isArchived": true
}
```

**Response (200 OK):**
```json
{
  "id": "card-123",
  "title": "Updated Title",
  "description": "Updated description",
  "isArchived": true,
}
```

### 5. Archive Card (Delete)
Archive a card (soft delete).

- **URL**: `/cards/:id`
- **Method**: `DELETE`

**Response (200 OK):**
```json
{
  "id": "card-123",
  "isArchived": true,
}
```

### 6. Assign Label to Card
Add a label to a card.

- **URL**: `/cards/:id/labels`
- **Method**: `POST`
- **Body**:
```json
{
  "labelId": "label-789"
}
```

**Response (201 Created):**
```json
{
  "cardId": "card-123",
  "labelId": "label-789",
  "assignedAt": "2023-10-27T10:10:00.000Z"
}
```

### 7. Remove Label from Card
Remove a label from a card.

- **URL**: `/cards/:id/labels/:labelId`
- **Method**: `DELETE`

**Response (200 OK):**
```json
{
  "message": "Label removed from card"
}
```

---

## Labels API

### 1. Get Board Labels
Get all labels available for a board.

- **URL**: `/boards/:id/labels`
- **Method**: `GET`

**Response (200 OK):**
```json
[
  {
    "id": "label-789",
    "name": "Urgent",
    "color": "#FF0000",
    "boardId": "board-123"
  }
]
```

### 2. Create Label
Create a new label for a board.

- **URL**: `/boards/:id/labels`
- **Method**: `POST`
- **Body**:
```json
{
  "name": "Bug",
  "color": "#FF0000" // Must be valid hex
}
```

**Response (201 Created):**
```json
{
  "id": "label-999",
  "name": "Bug",
  "color": "#FF0000",
  "boardId": "board-123"
}
```

### 3. Update Label
Update a label's name or color.

- **URL**: `/labels/:id`
- **Method**: `PATCH`
- **Body** (all fields optional):
```json
{
  "name": "Critical Bug",
  "color": "#8B0000"
}
```

**Response (200 OK):**
```json
{
  "id": "label-999",
  "name": "Critical Bug",
  "color": "#8B0000",
  "boardId": "board-123"
}
```

### 4. Delete Label
Delete a label permanently.

- **URL**: `/labels/:id`
- **Method**: `DELETE`

**Response (200 OK):**
```json
{
  "id": "label-999",
  "name": "Critical Bug",
  "color": "#8B0000",
  "boardId": "board-123"
}
```
