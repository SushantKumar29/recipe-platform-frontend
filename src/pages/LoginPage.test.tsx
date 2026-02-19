import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/providers';
import LoginPage from './LoginPage';
import type { LoginFormData } from '@/validation/loginSchema';

const mockLoginUser = vi.hoisted(() => vi.fn());
const mockToastSuccess = vi.hoisted(() => vi.fn());
const mockToastError = vi.hoisted(() => vi.fn());
const mockNavigate = vi.hoisted(() => vi.fn());
const mockOnSubmit = vi.hoisted(() => vi.fn());

vi.mock('@/slices/auth/authThunks', () => ({
  loginUser: mockLoginUser,
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

vi.mock('@/components/auth/LoginForm', () => ({
  default: ({ onSubmit }: { onSubmit: (data: LoginFormData) => void }) => {
    const wrappedOnSubmit = (data: LoginFormData) => {
      mockOnSubmit(data);
      return onSubmit(data);
    };
    return (
      <div data-testid="mock-login-form">
        <button
          onClick={() => wrappedOnSubmit({ email: 'test@example.com', password: 'password123' })}
        >
          Submit
        </button>
      </div>
    );
  },
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoginUser.mockReset();
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
    mockNavigate.mockReset();
    mockOnSubmit.mockReset();
  });

  it('renders the login form', () => {
    renderWithProviders(<LoginPage />, {
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

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-login-form')).toBeInTheDocument();
  });

  it('redirects to home page if already authenticated', () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: {
        auth: {
          user: { id: '1', email: 'test@example.com' },
          token: 'fake-token',
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('does not redirect if not authenticated', () => {
    renderWithProviders(<LoginPage />, {
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

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('dispatches loginUser and shows success toast on successful login', async () => {
    const user = userEvent.setup();

    const mockPromise = Object.assign(Promise.resolve({ type: 'login/fulfilled' }), {
      unwrap: vi.fn().mockRejectedValue({}),
    });
    mockPromise.unwrap = vi.fn().mockResolvedValue({});
    mockLoginUser.mockReturnValue(() => mockPromise);

    renderWithProviders(<LoginPage />, {
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
      email: 'test@example.com',
      password: 'password123',
    });

    expect(mockLoginUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Logged in successfully');
    });
  });

  it('shows error toast on login failure', async () => {
    const user = userEvent.setup();

    const error = new Error('Invalid credentials');
    const mockPromise = Object.assign(Promise.resolve({ type: 'login/rejected', error }), {
      unwrap: vi.fn().mockRejectedValue(error),
    });
    mockPromise.unwrap = vi.fn().mockRejectedValue(error);
    mockPromise.catch(() => {});

    mockLoginUser.mockReturnValue(() => mockPromise);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<LoginPage />, {
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
      email: 'test@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Invalid credentials');
    });

    consoleSpy.mockRestore();
  });

  it('handles non-Error login failure gracefully', async () => {
    const user = userEvent.setup();

    const error = new Error('Server error');
    const mockPromise = Object.assign(Promise.resolve({ type: 'login/rejected', error }), {
      unwrap: vi.fn().mockRejectedValue(error),
    });
    mockPromise.unwrap = vi.fn().mockRejectedValue(error);
    mockPromise.catch(() => {});

    mockLoginUser.mockReturnValue(() => mockPromise);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<LoginPage />, {
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
      email: 'test@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Server error');
    });

    consoleSpy.mockRestore();
  });
});
