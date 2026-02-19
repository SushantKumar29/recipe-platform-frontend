import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/providers';
import NewRecipePage from './NewRecipePage';
import type { RecipeFormData } from '@/validation/recipeSchema';

const mockCreateRecipe = vi.hoisted(() => vi.fn());
const mockToastSuccess = vi.hoisted(() => vi.fn());
const mockToastError = vi.hoisted(() => vi.fn());
const mockNavigate = vi.hoisted(() => vi.fn());
const mockOnSubmit = vi.hoisted(() => vi.fn());

vi.mock('@/slices/recipes/recipeThunks', () => ({
  createRecipe: mockCreateRecipe,
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

vi.mock('@/components/recipes/RecipeForm', () => ({
  default: ({ onSubmit }: { onSubmit: (data: RecipeFormData) => void }) => {
    const wrappedOnSubmit = (data: RecipeFormData) => {
      mockOnSubmit(data);
      return onSubmit(data);
    };
    return (
      <div data-testid="mock-recipe-form">
        <button
          onClick={() =>
            wrappedOnSubmit({
              title: 'Test Recipe',
              ingredients: 'Flour, Sugar, Eggs',
              preparationTime: 30,
              steps: 'Step 1: Mix. Step 2: Bake.',
              image: new File(['dummy'], 'test.jpg', { type: 'image/jpeg' }),
            })
          }
        >
          Submit
        </button>
      </div>
    );
  },
}));

describe('NewRecipePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateRecipe.mockReset();
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
    mockNavigate.mockReset();
    mockOnSubmit.mockReset();
  });

  it('renders the new recipe form', () => {
    renderWithProviders(<NewRecipePage />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: null,
          token: null,
          loading: false,
          error: null,
        },
      },
    });

    expect(screen.getByRole('heading', { name: /add your recipe/i })).toBeInTheDocument();
    expect(screen.getByTestId('mock-recipe-form')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    renderWithProviders(<NewRecipePage />, {
      preloadedState: {
        auth: {
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null,
        },
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('returns null when not authenticated', () => {
    const { container } = renderWithProviders(<NewRecipePage />, {
      preloadedState: {
        auth: {
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null,
        },
      },
    });

    expect(container.firstChild).toBeNull();
  });

  it('submits form and creates recipe with FormData', async () => {
    const user = userEvent.setup();

    const mockPromise = Object.assign(Promise.resolve({ type: 'recipe/create/fulfilled' }), {
      unwrap: vi.fn().mockRejectedValue({}),
    });
    mockPromise.unwrap = vi.fn().mockResolvedValue({});
    mockCreateRecipe.mockReturnValue(() => mockPromise);

    renderWithProviders(<NewRecipePage />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: null,
          token: null,
          loading: false,
          error: null,
        },
      },
    });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Recipe',
      ingredients: 'Flour, Sugar, Eggs',
      preparationTime: 30,
      steps: 'Step 1: Mix. Step 2: Bake.',
      image: expect.any(File),
    });

    expect(mockCreateRecipe).toHaveBeenCalledTimes(1);
    const formDataArg = mockCreateRecipe.mock.calls[0][0];
    expect(formDataArg).toBeInstanceOf(FormData);
    expect(formDataArg.get('title')).toBe('Test Recipe');
    expect(formDataArg.get('ingredients')).toBe('Flour, Sugar, Eggs');
    expect(formDataArg.get('preparationTime')).toBe('30');
    expect(formDataArg.get('steps')).toBe('Step 1: Mix. Step 2: Bake.');
    expect(formDataArg.get('image')).toBeInstanceOf(File);

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Recipe created successfully');
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows error toast on submission failure', async () => {
    const user = userEvent.setup();

    const error = new Error('Creation failed');

    const mockPromise = Object.assign(Promise.resolve({ type: 'recipe/create/rejected', error }), {
      unwrap: vi.fn().mockRejectedValue({}),
    });
    mockPromise.unwrap = vi.fn().mockRejectedValue(error);
    mockPromise.catch(() => {});

    mockCreateRecipe.mockReturnValue(() => mockPromise);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<NewRecipePage />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: null,
          token: null,
          loading: false,
          error: null,
        },
      },
    });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Creation failed');
    });

    consoleSpy.mockRestore();
  });

  it('handles non-Error failure gracefully', async () => {
    const user = userEvent.setup();

    const errorMessage = 'Server error';

    const mockPromise = Object.assign(
      Promise.resolve({ type: 'recipe/create/fulfilled', errorMessage }),
      {
        unwrap: vi.fn().mockRejectedValue({}),
      },
    );
    mockPromise.unwrap = vi.fn().mockRejectedValue(errorMessage);
    mockPromise.catch(() => {});

    mockCreateRecipe.mockReturnValue(() => mockPromise);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<NewRecipePage />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: null,
          token: null,
          loading: false,
          error: null,
        },
      },
    });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Server error');
    });

    consoleSpy.mockRestore();
  });

  it('navigates back when back button is clicked', async () => {
    const user = userEvent.setup();

    renderWithProviders(<NewRecipePage />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: null,
          token: null,
          loading: false,
          error: null,
        },
      },
    });

    const backButton = screen.getByRole('button', { name: /back/i });
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
