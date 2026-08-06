-- ─────────────────────────────────────────────────────────────────────────────
-- TrackWise — System Default Categories Seed Script
-- Inserts baseline expense & income categories when missing
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO categories (name, type, icon, color, is_default, user_id)
SELECT 'Housing & Rent', 'EXPENSE', 'home', '#EF4444', TRUE, NULL
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Housing & Rent' AND is_default = TRUE);

INSERT INTO categories (name, type, icon, color, is_default, user_id)
SELECT 'Groceries & Food', 'EXPENSE', 'shopping-cart', '#F59E0B', TRUE, NULL
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Groceries & Food' AND is_default = TRUE);

INSERT INTO categories (name, type, icon, color, is_default, user_id)
SELECT 'Transportation', 'EXPENSE', 'car', '#3B82F6', TRUE, NULL
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Transportation' AND is_default = TRUE);

INSERT INTO categories (name, type, icon, color, is_default, user_id)
SELECT 'Utilities & Bills', 'EXPENSE', 'zap', '#8B5CF6', TRUE, NULL
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Utilities & Bills' AND is_default = TRUE);

INSERT INTO categories (name, type, icon, color, is_default, user_id)
SELECT 'Entertainment & Leisure', 'EXPENSE', 'film', '#EC4899', TRUE, NULL
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Entertainment & Leisure' AND is_default = TRUE);

INSERT INTO categories (name, type, icon, color, is_default, user_id)
SELECT 'Healthcare & Medical', 'EXPENSE', 'heart-pulse', '#10B981', TRUE, NULL
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Healthcare & Medical' AND is_default = TRUE);

INSERT INTO categories (name, type, icon, color, is_default, user_id)
SELECT 'Salary & Wages', 'INCOME', 'briefcase', '#10B981', TRUE, NULL
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Salary & Wages' AND is_default = TRUE);

INSERT INTO categories (name, type, icon, color, is_default, user_id)
SELECT 'Investments & Dividends', 'INCOME', 'trending-up', '#06B6D4', TRUE, NULL
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Investments & Dividends' AND is_default = TRUE);

INSERT INTO categories (name, type, icon, color, is_default, user_id)
SELECT 'Freelance & Side Hustle', 'INCOME', 'laptop', '#F97316', TRUE, NULL
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Freelance & Side Hustle' AND is_default = TRUE);
