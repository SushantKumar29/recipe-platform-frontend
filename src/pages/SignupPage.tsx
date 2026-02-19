import type { AppDispatch, RootState } from '@/app/store';
import SignupForm from '@/components/auth/SignupForm';
import { registerUser } from '@/slices/auth/authThunks';
import type { SignupFormData } from '@/validation/signupSchema';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const SignupPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSignup = async (data: SignupFormData) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      toast.success('Signup successful');
    } catch (err: unknown) {
      toast.error((err as { message: string })?.message || 'Signup failed');
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="h-full my-16 py-16 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border-[#00ff9D] border-t-4 rounded-xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome to Recipe Platform
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Present your Recipes by creating an account
          </p>
        </div>

        <SignupForm onSubmit={handleSignup} />

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Already registered?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
