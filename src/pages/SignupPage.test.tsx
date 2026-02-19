import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/providers';
import SignupPage from './SignupPage';
import type { SignupFormData } from '@/validation/signupSchema';

const mockRegisterUser = vi.hoisted(() => vi.fn());
const mockToastSuccess = vi.hoisted(() => vi.fn());
const mockToastError = vi.hoisted(() => vi.fn());
const mockNavigate = vi.hoisted(() => vi.fn());
const mockOnSubmit = vi.hoisted(() => vi.fn());

vi.mock('@/slices/auth/authThunks', () => ({
  registerUser: mockRegisterUser,
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: mockToastSuccess,
    error: mockToastError,
  },
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/components/auth/SignupForm', () => ({
  default: ({ onSubmit }: { onSubmit: (data: SignupFormData) => void }) => {
    const wrappedOnSubmit = (data: SignupFormData) => {
      mockOnSubmit(data);
      return onSubmit(data);
    };
    return (
      <div data-testid="mock-signup-form">
        <button
          onClick={() =>
            wrappedOnSubmit({
              name: 'John Doe',
              email: 'john@example.com',
              password: 'password123',
              confirmPassword: 'password123',
            })
          }
        >
          Submit
        </button>
      </div>
    );
  },
}));

describe('SignupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRegisterUser.mockReset();
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
    mockNavigate.mockReset();
    mockOnSubmit.mockReset();
  });

  it('renders the signup form', () => {
    renderWithProviders(<SignupPage />, {
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        },
      },
    });

    expect(
      screen.getByRole('heading', { name: /welcome to recipe platform/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/present your recipes/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-signup-form')).toBeInTheDocument();
    expect(screen.getByText(/already registered/i)).toBeInTheDocument();
    expect(screen.getByText(/login here/i)).toBeInTheDocument();
  });

  it('redirects to home page if already authenticated', () => {
    renderWithProviders(<SignupPage />, {
      preloadedState: {
        auth: {
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
          token: 'fake-token',
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('returns null when authenticated', () => {
    const { container } = renderWithProviders(<SignupPage />, {
      preloadedState: {
        auth: {
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
          token: 'fake-token',
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    expect(container.firstChild).toBeNull();
  });

  it('dispatches registerUser and shows success toast on successful signup', async () => {
    const user = userEvent.setup();

    const mockPromise = Object.assign(Promise.resolve({ type: 'register/fulfilled' }), {
      unwrap: vi.fn().mockRejectedValue({}),
    });
    mockPromise.unwrap = vi.fn().mockResolvedValue({});
    mockRegisterUser.mockReturnValue(() => mockPromise);

    renderWithProviders(<SignupPage />, {
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        },
      },
    });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(mockRegisterUser).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Signup successful');
    });
  });

  it('shows error toast on signup failure', async () => {
    const user = userEvent.setup();

    const error = new Error('Registration failed');
    const mockPromise = Object.assign(Promise.resolve({ type: 'register/rejected', error }), {
      unwrap: vi.fn().mockRejectedValue({}),
    });
    mockPromise.unwrap = vi.fn().mockRejectedValue(error);
    mockPromise.catch(() => {});

    mockRegisterUser.mockReturnValue(() => mockPromise);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<SignupPage />, {
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        },
      },
    });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
    expect(mockRegisterUser).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Registration failed');
    });

    consoleSpy.mockRestore();
  });

  it('handles non-Error login failure gracefully', async () => {
    const user = userEvent.setup();

    const error = new Error('Signup failed');
    const mockPromise = Object.assign(Promise.resolve({ type: 'register/rejected', error }), {
      unwrap: vi.fn().mockRejectedValue({}),
    });
    mockPromise.unwrap = vi.fn().mockRejectedValue(error);
    mockPromise.catch(() => {});

    mockRegisterUser.mockReturnValue(() => mockPromise);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<SignupPage />, {
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        },
      },
    });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Signup failed');
    });

    consoleSpy.mockRestore();
  });
});
