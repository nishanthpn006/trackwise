import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name cannot exceed 100 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name cannot exceed 50 characters'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    message: 'Transaction type is required',
  }),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().min(1, 'Color is required'),
  description: z.string().max(255, 'Description cannot exceed 255 characters').optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const transactionSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  amount: z
    .number({ message: 'Amount must be a number' })
    .positive('Amount must be greater than 0'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    message: 'Type is required',
  }),
  categoryId: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export const budgetSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Budget name must be at least 2 characters')
      .max(60, 'Budget name cannot exceed 60 characters'),
    amount: z
      .number({ message: 'Amount must be a number' })
      .positive('Amount must be greater than 0'),
    period: z.enum(['MONTHLY', 'WEEKLY', 'YEARLY'], {
      message: 'Period is required',
    }),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    categoryId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: 'End date must be on or after start date',
      path: ['endDate'],
    }
  );

export type BudgetFormData = z.infer<typeof budgetSchema>;

