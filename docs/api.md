# TrackWise — REST API Documentation

**Base URL (local development)**: `http://localhost:8080/api`  
**Base URL (Docker)**: `http://localhost/api`  
**Content-Type**: `application/json`  
**Authentication**: Bearer JWT (see [Authentication](#authentication))

---

## Table of Contents

- [Authentication](#authentication)
- [Auth Endpoints](#auth-endpoints)
- [Transactions](#transactions)
- [Categories](#categories)
- [Budgets](#budgets)
- [Savings Goals](#savings-goals)
- [Reports](#reports)
- [Dashboard](#dashboard)
- [Users / Settings](#users--settings)
- [Notifications](#notifications)
- [Import / Export](#import--export)
- [Error Codes](#error-codes)

---

## Authentication

All endpoints except `/api/auth/register` and `/api/auth/login` require a valid JWT token.

Include the token in every request header:

```http
Authorization: Bearer <your_jwt_token>
```

Tokens expire after 24 hours (configurable via `JWT_EXPIRATION_MS`).

On expiry, the client receives `401 Unauthorized`. The frontend automatically
removes the stored token and redirects to `/login`.

---

## Auth Endpoints

### POST `/api/auth/register`

Register a new user account.

**Request body:**

```json
{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

**Response `201 Created`**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "role": "USER"
  }
}
```

**Errors**: `400` validation failure · `409` email already registered

---

### POST `/api/auth/login`

Authenticate and receive a JWT token.

**Request body:**

```json
{
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

**Response `200 OK`**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "role": "USER"
  }
}
```

**Errors**: `400` invalid credentials · `401` bad password

---

## Transactions

### GET `/api/transactions`

List paginated transactions for the authenticated user.

**Query parameters:**

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | int | `0` | Zero-based page number |
| `size` | int | `20` | Items per page |
| `search` | string | — | Filter by title (case-insensitive) |
| `type` | enum | — | `INCOME` or `EXPENSE` |
| `categoryId` | UUID | — | Filter by category |
| `startDate` | date | — | `YYYY-MM-DD` |
| `endDate` | date | — | `YYYY-MM-DD` |

**Response `200 OK`**

```json
{
  "content": [
    {
      "id": "uuid",
      "title": "Grocery Shopping",
      "amount": 45.50,
      "type": "EXPENSE",
      "description": "Weekly groceries",
      "date": "2024-08-01",
      "category": {
        "id": "uuid",
        "name": "Food",
        "type": "EXPENSE",
        "icon": "ShoppingCart",
        "color": "#22c55e"
      },
      "createdAt": "2024-08-01T10:00:00Z"
    }
  ],
  "totalElements": 150,
  "totalPages": 8,
  "size": 20,
  "number": 0
}
```

---

### POST `/api/transactions`

Create a new transaction.

**Request body:**

```json
{
  "title": "Grocery Shopping",
  "amount": 45.50,
  "type": "EXPENSE",
  "categoryId": "uuid",
  "date": "2024-08-01",
  "description": "Weekly groceries"
}
```

**Response `201 Created`** — same as single transaction object above.

**Errors**: `400` validation failure

---

### PUT `/api/transactions/{id}`

Update an existing transaction. Same request body as POST.

**Response `200 OK`** — updated transaction object.

**Errors**: `400` validation · `403` not owner · `404` not found

---

### DELETE `/api/transactions/{id}`

Delete a transaction.

**Response `204 No Content`**

**Errors**: `403` not owner · `404` not found

---

## Categories

### GET `/api/categories`

List all categories for the authenticated user.

**Query parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `type` | enum | Optional: `INCOME` or `EXPENSE` |

**Response `200 OK`**

```json
[
  {
    "id": "uuid",
    "name": "Food",
    "type": "EXPENSE",
    "icon": "ShoppingCart",
    "color": "#22c55e",
    "createdAt": "2024-08-01T10:00:00Z"
  }
]
```

---

### POST `/api/categories`

Create a new category.

```json
{
  "name": "Food",
  "type": "EXPENSE",
  "icon": "ShoppingCart",
  "color": "#22c55e"
}
```

**Response `201 Created`** — category object.

---

### PUT `/api/categories/{id}`

Update an existing category. Same request body as POST.

**Response `200 OK`**

---

### DELETE `/api/categories/{id}`

Delete a category. Fails if the category is still referenced by transactions.

**Response `204 No Content`**

**Errors**: `403` not owner · `404` not found · `409` category in use

---

## Budgets

### GET `/api/budgets`

List all budgets for the authenticated user, each including live `spentAmount`.

**Response `200 OK`**

```json
[
  {
    "id": "uuid",
    "name": "Monthly Food Budget",
    "limitAmount": 500.00,
    "spentAmount": 312.50,
    "period": "MONTHLY",
    "startDate": "2024-08-01",
    "endDate": null,
    "active": true,
    "category": { "id": "uuid", "name": "Food", "type": "EXPENSE", "icon": "ShoppingCart", "color": "#22c55e" },
    "createdAt": "2024-08-01T10:00:00Z"
  }
]
```

---

### POST `/api/budgets`

```json
{
  "name": "Monthly Food Budget",
  "limitAmount": 500.00,
  "categoryId": "uuid",
  "period": "MONTHLY",
  "startDate": "2024-08-01",
  "endDate": null
}
```

**Response `201 Created`** — budget object with `spentAmount`.

---

### PUT `/api/budgets/{id}`

Update an existing budget.

**Response `200 OK`**

---

### DELETE `/api/budgets/{id}`

**Response `204 No Content`**

---

## Savings Goals

### GET `/api/goals`

**Response `200 OK`**

```json
[
  {
    "id": "uuid",
    "name": "Emergency Fund",
    "description": "3 months of expenses",
    "targetAmount": 10000.00,
    "currentAmount": 3500.00,
    "progressPercentage": 35.0,
    "targetDate": "2025-01-01",
    "status": "IN_PROGRESS",
    "contributions": [],
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

---

### POST `/api/goals`

```json
{
  "name": "Emergency Fund",
  "description": "3 months of expenses",
  "targetAmount": 10000.00,
  "targetDate": "2025-01-01"
}
```

**Response `201 Created`**

---

### POST `/api/goals/{id}/contributions`

Add a contribution to a goal.

```json
{
  "amount": 500.00,
  "date": "2024-08-01",
  "notes": "Monthly savings deposit"
}
```

**Response `201 Created`** — updated goal object.

---

### PUT `/api/goals/{id}`

Update goal details.

---

### DELETE `/api/goals/{id}`

Deletes goal and all contributions (cascade).

**Response `204 No Content`**

---

## Reports

### GET `/api/reports/summary`

Monthly income/expense/savings summary.

**Query parameters**: `startDate`, `endDate` (`YYYY-MM-DD`)

**Response `200 OK`**

```json
{
  "totalIncome": 5000.00,
  "totalExpense": 3200.00,
  "netSavings": 1800.00,
  "startDate": "2024-08-01",
  "endDate": "2024-08-31"
}
```

---

### GET `/api/reports/category-breakdown`

Expense breakdown by category.

**Response `200 OK`**

```json
[
  { "categoryName": "Food", "amount": 312.50, "percentage": 20.5 },
  { "categoryName": "Transport", "amount": 145.00, "percentage": 9.5 }
]
```

---

### GET `/api/reports/monthly-trend`

Monthly income vs. expense over a date range.

**Response `200 OK`**

```json
[
  { "month": "2024-06", "income": 5000.00, "expense": 3100.00 },
  { "month": "2024-07", "income": 5200.00, "expense": 3400.00 }
]
```

---

## Dashboard

### GET `/api/dashboard/summary`

Top-level financial overview for the current month.

**Response `200 OK`**

```json
{
  "totalBalance": 12500.00,
  "monthlyIncome": 5000.00,
  "monthlyExpense": 3200.00,
  "recentTransactions": [ ... ],
  "activeBudgets": [ ... ],
  "activeGoals": [ ... ]
}
```

---

## Users / Settings

### GET `/api/users/profile`

Get the authenticated user's profile.

**Response `200 OK`**

```json
{
  "id": "uuid",
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "currency": "USD",
  "locale": "en-US",
  "budgetAlertsEnabled": true,
  "goalAlertsEnabled": true,
  "weeklyReportsEnabled": false
}
```

---

### PUT `/api/users/profile`

Update profile fields.

```json
{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "currency": "USD",
  "locale": "en-US"
}
```

---

### PUT `/api/users/password`

Change password.

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Errors**: `400` current password incorrect

---

### PUT `/api/users/notifications`

Update notification preferences.

```json
{
  "budgetAlertsEnabled": true,
  "goalAlertsEnabled": true,
  "weeklyReportsEnabled": false
}
```

---

### GET `/api/users/statistics`

Account statistics.

**Response `200 OK`**

```json
{
  "transactionCount": 150,
  "categoryCount": 12,
  "budgetCount": 4,
  "goalCount": 3,
  "memberSince": "2024-01-01T10:00:00Z"
}
```

---

## Notifications

### GET `/api/notifications`

Paginated notification list.

**Query params**: `page`, `size`

**Response `200 OK`**

```json
{
  "totalCount": 25,
  "unreadCount": 5,
  "notifications": [
    {
      "id": "uuid",
      "title": "Budget Alert",
      "message": "You have exceeded your Food budget for August.",
      "type": "BUDGET_ALERT",
      "priority": "HIGH",
      "read": false,
      "createdAt": "2024-08-04T10:00:00Z"
    }
  ]
}
```

---

### PATCH `/api/notifications/{id}/read`

Mark a single notification as read.

**Response `200 OK`** — updated notification object.

---

### PATCH `/api/notifications/read-all`

Mark all notifications as read.

**Response `200 OK`**

---

### DELETE `/api/notifications/{id}`

Delete a notification.

**Response `204 No Content`**

---

## Import / Export

### GET `/api/data/export/transactions`

Download all transactions as CSV.

**Response `200 OK`**  
`Content-Type: text/csv`  
`Content-Disposition: attachment; filename="transactions.csv"`

```csv
Date,Title,Amount,Type,Category,Description
2024-08-01,Grocery Shopping,45.50,EXPENSE,Food,Weekly groceries
```

---

### GET `/api/data/export/backup`

Download a full account backup CSV.

**Response `200 OK`**  
`Content-Disposition: attachment; filename="trackwise-backup.csv"`

---

### POST `/api/data/import/transactions`

Import transactions from a CSV file.

**Request**: `multipart/form-data`, field name `file`

**Response `200 OK`**

```json
{
  "imported": 45,
  "failed": 2,
  "errors": [
    "Row 3: Invalid date format '13/32/2024'",
    "Row 7: Amount must be a positive number"
  ]
}
```

---

### GET `/api/data/template`

Download the CSV import template.

**Response `200 OK`**  
`Content-Disposition: attachment; filename="import-template.csv"`

---

## Error Codes

| Status | Meaning | Common Cause |
| --- | --- | --- |
| `200 OK` | Success | — |
| `201 Created` | Resource created | POST endpoints |
| `204 No Content` | Success, no body | DELETE endpoints |
| `400 Bad Request` | Validation failure | Missing/invalid fields |
| `401 Unauthorized` | No / expired token | Missing Authorization header or token expired |
| `403 Forbidden` | Not resource owner | Attempting to access another user's data |
| `404 Not Found` | Resource not found | Wrong UUID in path |
| `409 Conflict` | Duplicate resource | Duplicate email on register |
| `500 Internal Server Error` | Server error | Unexpected backend failure |

### Error Response Body

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Amount must be greater than zero",
  "timestamp": "2024-08-04T10:00:00Z",
  "path": "/api/transactions"
}
```
