-- ─────────────────────────────────────────────────────────────────────────────
-- TrackWise — PostgreSQL Production Schema DDL Script
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    phone VARCHAR(30),
    currency VARCHAR(10) DEFAULT 'INR',
    timezone VARCHAR(50) DEFAULT 'UTC',
    bio VARCHAR(500),
    avatar_url VARCHAR(1000),
    last_login_at TIMESTAMP,
    password_changed_at TIMESTAMP,
    date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',
    time_format VARCHAR(10) DEFAULT '24h',
    first_day_of_week VARCHAR(15) DEFAULT 'Monday',
    number_format VARCHAR(15) DEFAULT 'en-IN',
    language VARCHAR(10) DEFAULT 'en',
    theme VARCHAR(15) DEFAULT 'system',
    budget_alerts BOOLEAN DEFAULT TRUE,
    goal_alerts BOOLEAN DEFAULT TRUE,
    monthly_summary BOOLEAN DEFAULT TRUE,
    weekly_summary BOOLEAN DEFAULT FALSE,
    security_alerts BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(20),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_category_name UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id);

-- 3. Accounts Table
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(30) NOT NULL,
    initial_balance DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    current_balance DECIMAL(14, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'INR',
    color VARCHAR(30) DEFAULT '#3B82F6',
    icon VARCHAR(50) DEFAULT 'wallet',
    description VARCHAR(255),
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_accounts_user ON accounts(user_id);

-- 4. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type VARCHAR(20) NOT NULL,
    description VARCHAR(500),
    date DATE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account_id);

-- 5. Recurring Transactions Table
CREATE TABLE IF NOT EXISTS recurring_transactions (
    id UUID PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type VARCHAR(20) NOT NULL,
    frequency VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    next_execution_date DATE NOT NULL,
    end_date DATE,
    last_executed_at TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    description VARCHAR(500),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_recurring_txs_user ON recurring_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_txs_next_exec ON recurring_transactions(next_execution_date, is_active);

-- 6. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL,
    next_billing_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    description VARCHAR(255),
    reminder_days_before INT DEFAULT 3,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

-- 7. Bill Reminders Table
CREATE TABLE IF NOT EXISTS bill_reminders (
    id UUID PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    frequency VARCHAR(20) NOT NULL DEFAULT 'MONTHLY',
    status VARCHAR(20) NOT NULL DEFAULT 'UPCOMING',
    paid_at TIMESTAMP,
    notes VARCHAR(255),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bill_reminders_user ON bill_reminders(user_id);

-- 8. Budgets Table
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    period VARCHAR(20) NOT NULL DEFAULT 'MONTHLY',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Goals Table
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    current_amount DECIMAL(12, 2) DEFAULT 0.00,
    target_date DATE NOT NULL,
    category VARCHAR(50),
    icon VARCHAR(50),
    color VARCHAR(30),
    description VARCHAR(255),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Goal Contributions Table
CREATE TABLE IF NOT EXISTS goal_contributions (
    id UUID PRIMARY KEY,
    amount DECIMAL(12, 2) NOT NULL,
    date DATE NOT NULL,
    note VARCHAR(255),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    type VARCHAR(30) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url VARCHAR(255),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE
);
