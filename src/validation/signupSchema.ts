import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z
      .string()
      .nonempty('Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters')
      .regex(/^[A-Za-z\s]+$/, 'Name cannot contain numbers or special characters'),
    email: z.string().nonempty('Email is required').email('Invalid email address'),
    password: z
      .string()
      .nonempty('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().nonempty('Confirm Password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
