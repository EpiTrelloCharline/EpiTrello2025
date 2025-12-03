#!/bin/bash

# 🎨 Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 📝 Configuration
API_URL="http://localhost:3000"
TOKEN=""
BOARD_ID=""
CARD_ID=""

# Function to print section header
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
    fi
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  Warning: jq is not installed. Install it for better JSON output.${NC}"
fi

# Load configuration
if [ -f ".env.test" ]; then
    source .env.test
    echo -e "${GREEN}✅ Configuration loaded from .env.test${NC}"
else
    echo -e "${YELLOW}⚠️  No .env.test file found. Please create one with:${NC}"
    echo "TOKEN=your_jwt_token"
    echo "BOARD_ID=your_board_id"
    echo "CARD_ID=your_card_id"
    exit 1
fi

# Validate configuration
if [ -z "$TOKEN" ] || [ -z "$BOARD_ID" ] || [ -z "$CARD_ID" ]; then
    echo -e "${RED}❌ Error: TOKEN, BOARD_ID, and CARD_ID must be set in .env.test${NC}"
    exit 1
fi

# ==================== TEST 1: GET Labels ====================
print_header "TEST 1: GET /boards/:id/labels"

response=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/boards/$BOARD_ID/labels" \
  -H "Authorization: Bearer $TOKEN")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 200 ]; then
    print_result 0 "GET labels (200 OK)"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    print_result 1 "GET labels (expected 200, got $http_code)"
    echo "$body"
fi

# ==================== TEST 2: CREATE Label (Urgent) ====================
print_header "TEST 2: POST /boards/:id/labels (Create Urgent)"

response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/boards/$BOARD_ID/labels" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Urgent", "color": "#FF0000"}')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 201 ]; then
    print_result 0 "CREATE label Urgent (201 Created)"
    LABEL_ID_1=$(echo "$body" | jq -r '.id' 2>/dev/null)
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    echo -e "${GREEN}LABEL_ID_1: $LABEL_ID_1${NC}"
else
    print_result 1 "CREATE label (expected 201, got $http_code)"
    echo "$body"
fi

# ==================== TEST 3: CREATE Label (En cours) ====================
print_header "TEST 3: POST /boards/:id/labels (Create En cours)"

response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/boards/$BOARD_ID/labels" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "En cours", "color": "#0000FF"}')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 201 ]; then
    print_result 0 "CREATE label En cours (201 Created)"
    LABEL_ID_2=$(echo "$body" | jq -r '.id' 2>/dev/null)
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    echo -e "${GREEN}LABEL_ID_2: $LABEL_ID_2${NC}"
else
    print_result 1 "CREATE label (expected 201, got $http_code)"
    echo "$body"
fi

# ==================== TEST 4: CREATE Label (Terminé) ====================
print_header "TEST 4: POST /boards/:id/labels (Create Terminé)"

response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/boards/$BOARD_ID/labels" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Terminé", "color": "#00FF00"}')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 201 ]; then
    print_result 0 "CREATE label Terminé (201 Created)"
    LABEL_ID_3=$(echo "$body" | jq -r '.id' 2>/dev/null)
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    echo -e "${GREEN}LABEL_ID_3: $LABEL_ID_3${NC}"
else
    print_result 1 "CREATE label (expected 201, got $http_code)"
    echo "$body"
fi

# ==================== TEST 5: CREATE Label - Invalid Color ====================
print_header "TEST 5: POST /boards/:id/labels (Invalid color)"

response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/boards/$BOARD_ID/labels" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Invalid", "color": "red"}')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 400 ]; then
    print_result 0 "CREATE label with invalid color (400 Bad Request)"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    print_result 1 "CREATE label invalid (expected 400, got $http_code)"
    echo "$body"
fi

# ==================== TEST 6: UPDATE Label ====================
print_header "TEST 6: PATCH /labels/:id (Update name)"

if [ -n "$LABEL_ID_1" ]; then
    response=$(curl -s -w "\n%{http_code}" -X PATCH "$API_URL/labels/$LABEL_ID_1" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"name": "Très Urgent"}')

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" -eq 200 ]; then
        print_result 0 "UPDATE label (200 OK)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        print_result 1 "UPDATE label (expected 200, got $http_code)"
        echo "$body"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping UPDATE test (no LABEL_ID_1)${NC}"
fi

# ==================== TEST 7: ASSIGN Label to Card ====================
print_header "TEST 7: POST /cards/:id/labels (Assign label)"

if [ -n "$LABEL_ID_1" ]; then
    response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/cards/$CARD_ID/labels" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"labelId\": \"$LABEL_ID_1\"}")

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" -eq 201 ] || [ "$http_code" -eq 200 ]; then
        print_result 0 "ASSIGN label to card ($http_code)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        print_result 1 "ASSIGN label (expected 201/200, got $http_code)"
        echo "$body"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping ASSIGN test (no LABEL_ID_1)${NC}"
fi

# ==================== TEST 8: ASSIGN Duplicate ====================
print_header "TEST 8: POST /cards/:id/labels (Assign duplicate)"

if [ -n "$LABEL_ID_1" ]; then
    response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/cards/$CARD_ID/labels" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"labelId\": \"$LABEL_ID_1\"}")

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" -eq 200 ]; then
        print_result 0 "ASSIGN duplicate label (200 OK - already assigned message)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        print_result 1 "ASSIGN duplicate (expected 200, got $http_code)"
        echo "$body"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping duplicate ASSIGN test (no LABEL_ID_1)${NC}"
fi

# ==================== TEST 9: REMOVE Label from Card ====================
print_header "TEST 9: DELETE /cards/:id/labels/:labelId (Remove label)"

if [ -n "$LABEL_ID_1" ]; then
    response=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL/cards/$CARD_ID/labels/$LABEL_ID_1" \
      -H "Authorization: Bearer $TOKEN")

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" -eq 200 ]; then
        print_result 0 "REMOVE label from card (200 OK)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        print_result 1 "REMOVE label (expected 200, got $http_code)"
        echo "$body"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping REMOVE test (no LABEL_ID_1)${NC}"
fi

# ==================== TEST 10: DELETE Label ====================
print_header "TEST 10: DELETE /labels/:id (Delete label)"

if [ -n "$LABEL_ID_3" ]; then
    response=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL/labels/$LABEL_ID_3" \
      -H "Authorization: Bearer $TOKEN")

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" -eq 200 ]; then
        print_result 0 "DELETE label (200 OK)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        print_result 1 "DELETE label (expected 200, got $http_code)"
        echo "$body"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping DELETE test (no LABEL_ID_3)${NC}"
fi

# ==================== FINAL: List all labels ====================
print_header "FINAL: GET /boards/:id/labels (List all remaining labels)"

response=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/boards/$BOARD_ID/labels" \
  -H "Authorization: Bearer $TOKEN")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 200 ]; then
    print_result 0 "GET labels (200 OK)"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    print_result 1 "GET labels (expected 200, got $http_code)"
    echo "$body"
fi

print_header "🎉 Tests Completed!"
echo -e "${GREEN}Don't forget to test 403 cases with a different user!${NC}"
