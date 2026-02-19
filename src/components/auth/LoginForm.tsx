import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginFormData } from '@/validation/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';

type LoginFormProps = {
  onSubmit: (data: LoginFormData) => Promise<void>;
};
const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup className="gap-2">
          <Field className="gap-1">
            <FieldLabel htmlFor="fieldgroup-email" className="text-sm sm:text-base">
              Email
            </FieldLabel>
            <Input
              id="fieldgroup-email"
              placeholder="name@example.com"
              type="email"
              className="text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3"
              {...register('email')}
            />
            <div className="min-h-6">
              {errors.email && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>
          </Field>
          <Field className="gap-1">
            <FieldLabel htmlFor="fieldgroup-password" className="text-sm sm:text-base">
              Password
            </FieldLabel>
            <Input
              id="fieldgroup-password"
              type="password"
              className="text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3"
              {...register('password')}
            />
            <div className="min-h-6">
              {errors.password && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>
          </Field>
          <Field orientation="horizontal" className="flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default LoginForm;
