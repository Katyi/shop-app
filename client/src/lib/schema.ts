import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().nonempty('Email is required').email('Invalid email format'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .nonempty('Name is required')
      .min(2, 'Username must be at least 2 characters long'),
    email: z
      .string()
      .nonempty('Email is required')
      .email('Invalid email format'),
    password: z
      .string()
      .nonempty('Password is required')
      .min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z
      .string()
      .nonempty('Please confirm your password')
      .min(6, 'Password must be at least 6 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const profileSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters long')
    .optional(),
  fullname: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .optional()
    .or(z.literal('')),
  // email: z.string().email('Invalid email format').min(1, 'Email is required'),
  email: z.string().email('Invalid email format').nonempty('Email is required'),

  phone: z
    .string()
    .refine((val) => {
      // Если поле пустое — пропускаем, если нет — должно быть 11 цифр
      const digits = val.replace(/\D/g, '');
      return digits.length === 0 || digits.length === 11;
    }, 'Phone number must contain 11 digits')
    .optional()
    .or(z.literal('')),
  birthday: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
  occupation: z.string().optional().or(z.literal('')),
});
