# TrackWise — User Guide

Welcome to TrackWise, your personal expense tracker. This guide walks you
through every feature available in version 1.0.0.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Registration](#registration)
- [Login](#login)
- [Dashboard](#dashboard)
- [Transactions](#transactions)
- [Categories](#categories)
- [Budgets](#budgets)
- [Savings Goals](#savings-goals)
- [Reports & Analytics](#reports--analytics)
- [Settings](#settings)
- [Notifications](#notifications)
- [Import & Export](#import--export)

---

## Getting Started

TrackWise is a web application that runs in your browser. No download or
installation is required. To start:

1. Open the app at `http://localhost` (Docker) or `http://localhost:5173` (local dev).
2. Register a new account.
3. Begin adding your income and expenses.

---

## Registration

1. Click **Register** on the login page.
2. Enter your **full name**, **email address**, and a **strong password**.
3. Click **Create Account**.
4. You will be automatically logged in and taken to the dashboard.

> Your password is stored as a secure hash — TrackWise never stores your plain-text password.

---

## Login

1. Enter your **email** and **password**.
2. Click **Sign In**.
3. Your session lasts 24 hours. After that, you will be prompted to log in again.

---

## Dashboard

The Dashboard gives you a real-time snapshot of your financial health.

| Section | Description |
| --- | --- |
| **Balance** | Your total balance (sum of all income minus all expenses) |
| **Monthly Income** | Total income recorded this month |
| **Monthly Expense** | Total expenses recorded this month |
| **Recent Transactions** | The 10 most recent transactions |
| **Active Budgets** | Your active budget cards with spending progress |
| **Active Goals** | Your savings goals with progress bars |

---

## Transactions

Transactions are the core of TrackWise. Every income or expense you record
is a transaction.

### Adding a Transaction

1. Navigate to **Transactions** in the sidebar.
2. Click **Add Transaction**.
3. Fill in:
   - **Title** — short description (e.g. "Grocery shopping")
   - **Amount** — positive number
   - **Type** — `Income` or `Expense`
   - **Category** — select from your categories
   - **Date** — the date of the transaction
   - **Description** — optional longer note
4. Click **Save**.

### Searching and Filtering

Use the controls at the top of the Transactions page to:

- **Search** by title (updates as you type)
- **Filter by type**: All / Income / Expense
- **Filter by category**
- **Filter by date range**: pick start and end dates

### Editing a Transaction

Click the **edit (pencil)** icon on any transaction row to open the edit dialog.
Make your changes and click **Save**.

### Deleting a Transaction

Click the **delete (trash)** icon on any transaction row. Confirm the deletion
in the popup dialog.

---

## Categories

Categories let you classify your transactions (e.g. Food, Transport, Salary).

### Adding a Category

1. Navigate to **Categories** in the sidebar.
2. Click **Add Category**.
3. Enter a **name**, select a **type** (Income/Expense), choose an **icon** and a **color**.
4. Click **Save**.

### Editing / Deleting

Use the edit and delete icons on each category card. You cannot delete a
category that is still assigned to transactions.

---

## Budgets

Budgets help you control spending by setting limits per category.

### Creating a Budget

1. Navigate to **Budgets** in the sidebar.
2. Click **Add Budget**.
3. Fill in:
   - **Name** — e.g. "Monthly Groceries"
   - **Category** — the category to track
   - **Limit Amount** — your spending ceiling
   - **Period** — Monthly, Weekly, or Custom
   - **Start Date** / **End Date** (for custom period)
4. Click **Save**.

### Understanding the Budget Card

Each budget card shows:

- **Spent so far** vs. **Limit**
- A **progress bar**: green when under limit, red when exceeded
- A **percentage** of budget used
- A warning notification when you go over budget

---

## Savings Goals

Goals help you save toward a specific target (e.g. Emergency Fund, Vacation).

### Creating a Goal

1. Navigate to **Goals** in the sidebar.
2. Click **Add Goal**.
3. Fill in:
   - **Name** — e.g. "Emergency Fund"
   - **Target Amount** — the amount you want to save
   - **Target Date** — your deadline
   - **Description** — optional
4. Click **Save**.

### Recording a Contribution

1. Click **Add Contribution** on a goal card.
2. Enter the **amount**, **date**, and optional **notes**.
3. Click **Save**. The progress bar updates immediately.

### Goal Status

| Status | Meaning |
| --- | --- |
| **In Progress** | Active goal, target not yet reached |
| **Completed** | `currentAmount ≥ targetAmount` |
| **Cancelled** | Manually cancelled |

---

## Reports & Analytics

The Reports page gives you a visual overview of your finances.

### Available Charts

| Chart | Description |
| --- | --- |
| **Monthly Summary** | Total income, expense, and net savings for the selected period |
| **Category Breakdown** | Pie chart of expense distribution by category |
| **Income vs. Expense Trend** | Line chart of monthly income and expense over time |

### Changing the Date Range

Use the **date range picker** at the top of the Reports page to select any
start and end date. All charts update automatically.

---

## Settings

The Settings page lets you manage your profile, password, and preferences.

### Profile

- Update your **full name** and **email address**.
- Click **Save Changes** to apply.

### Change Password

1. Enter your **current password**.
2. Enter a **new password** (minimum 6 characters).
3. Confirm the new password.
4. Click **Change Password**.

### Preferences

- **Currency** — sets the currency label displayed throughout the app.
- **Locale** — sets the number and date formatting locale.

### Notification Preferences

Toggle on/off:

- Budget alerts (notified when a budget is exceeded)
- Goal alerts (notified on goal milestones)
- Weekly reports

---

## Notifications

The Notifications page shows all your in-app alerts.

### Unread Badge

A badge on the **Notifications** sidebar item shows how many unread
notifications you have.

### Actions

| Action | How |
| --- | --- |
| Mark as read | Click the notification or use the **Mark as Read** button |
| Mark all as read | Click **Mark All Read** at the top |
| Delete | Click the **trash** icon on any notification |

### Notification Types

| Type | Trigger |
| --- | --- |
| **Budget Alert** | When spending exceeds your budget limit |
| **Goal Milestone** | When you reach 50%, 100% of a goal |
| **System** | App-level announcements |

---

## Import & Export

### Exporting Transactions

1. Navigate to **Import / Export** in the sidebar.
2. Under **Export**, click **Export Transactions (CSV)**.
3. A CSV file will download to your device.

### Full Account Backup

Click **Export Full Backup (CSV)** to download a multi-section CSV containing
all your transactions, categories, budgets, and goals.

### Importing Transactions

1. Click **Download Template** to get the required CSV format.
2. Fill in the template with your transactions.
3. Under **Import**, click **Choose File** and select your CSV.
4. Click **Import Transactions**.
5. A result summary shows how many rows were imported and any errors.

### CSV Template Format

```csv
Date,Title,Amount,Type,Category,Description
2024-08-01,Grocery Shopping,45.50,EXPENSE,Food,Weekly groceries
```
