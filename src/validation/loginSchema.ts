import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().nonempty('Email is required').email('Invalid email address'),
  password: z.string().nonempty('Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
