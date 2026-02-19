import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { signupSchema, type SignupFormData } from '@/validation/signupSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type SignupFormProps = {
  onSubmit: (data: SignupFormData) => Promise<void>;
};

const SignupForm = ({ onSubmit }: SignupFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-2">
        <Field className="gap-1">
          <FieldLabel htmlFor="fieldgroup-name" className="text-sm sm:text-base">
            Name
          </FieldLabel>
          <Input
            id="fieldgroup-name"
            placeholder="John Doe"
            type="text"
            className="text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3"
            {...register('name')}
          />
          <div className="min-h-6">
            {errors.name && (
              <p className="text-xs sm:text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
        </Field>
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
              <p className="text-xs sm:text-sm text-red-600">{errors.email.message}</p>
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
              <p className="text-xs sm:text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
        </Field>
        <Field className="gap-1">
          <FieldLabel htmlFor="fieldgroup-confirm-password" className="text-sm sm:text-base">
            Confirm Password
          </FieldLabel>
          <Input
            id="fieldgroup-confirm-password"
            type="password"
            className="text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3"
            {...register('confirmPassword')}
          />
          <div className="min-h-6">
            {errors.confirmPassword && (
              <p className="text-xs sm:text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </Field>
        <Field orientation="horizontal" className="flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2"
          >
            {isSubmitting ? 'Signing up...' : 'Sign up'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default SignupForm;
