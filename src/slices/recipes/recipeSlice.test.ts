import { describe, it, expect } from 'vitest';
import recipeReducer, {
  fetchStart,
  setRecipes,
  setRecipeDetail,
  fetchError,
  clearSelectedRecipe,
  setComments,
  addComment,
} from './recipeSlice';
import type { Recipe, RecipeDetail } from '../../types/recipes/recipeTypes';
import type { Comment } from '@/types/comments/commentTypes';

describe('recipeSlice', () => {
  const initialState = {
    items: [],
    selectedRecipe: null,
    comments: [],
    commentsLoading: false,
    commentsPagination: null,
    loading: false,
    isRateLimited: false,
    pagination: null,
    ratingLoading: false,
    ratingError: null,
    userRating: null,
    updatingCommentId: null,
    deletingCommentId: null,
  };

  const mockRecipe: Recipe = {
    id: '1',
    title: 'Test Recipe',
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    steps: ['Step 1', 'Step 2'],
    author: 'author1',
    isPublished: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    ratingCount: 5,
    averageRating: 4.5,
    preparationTime: 30,
  };

  const mockRecipeDetail: RecipeDetail = {
    ...mockRecipe,
    author: { id: 'author1', name: 'Test Author', email: 'author@test.com' },
    ratings: [],
  };

  const mockComment: Comment = {
    id: 'comment1',
    content: 'Great recipe!',
    author: { id: 'user1', name: 'Test User', email: 'test@example.com' },
    authorId: 'user1',
    recipe: '1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  it('should return initial state', () => {
    expect(recipeReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('should handle fetchStart', () => {
    const state = recipeReducer(initialState, fetchStart());

    expect(state.loading).toBe(true);
    expect(state.isRateLimited).toBe(false);
  });

  it('should handle setRecipes', () => {
    const payload = {
      data: [mockRecipe],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        pages: 1,
      },
    };

    const state = recipeReducer(initialState, setRecipes(payload));

    expect(state.items).toEqual([mockRecipe]);
    expect(state.pagination).toEqual(payload.pagination);
    expect(state.loading).toBe(false);
  });

  it('should handle setRecipes without pagination', () => {
    const payload = {
      data: [mockRecipe],
    };

    const state = recipeReducer(initialState, setRecipes(payload));

    expect(state.items).toEqual([mockRecipe]);
    expect(state.pagination).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('should handle setRecipeDetail', () => {
    const state = recipeReducer(initialState, setRecipeDetail(mockRecipeDetail));

    expect(state.selectedRecipe).toEqual(mockRecipeDetail);
    expect(state.loading).toBe(false);
  });

  it('should handle fetchError', () => {
    const state = recipeReducer({ ...initialState, loading: true }, fetchError());

    expect(state.loading).toBe(false);
  });

  it('should handle clearSelectedRecipe', () => {
    const stateWithRecipe = {
      ...initialState,
      selectedRecipe: mockRecipeDetail,
      comments: [mockComment],
      commentsPagination: {
        page: 1,
        totalPages: 1,
        totalComments: 1,
        hasNext: false,
        hasPrev: false,
        limit: 10,
      },
      userRating: { recipeId: '1', value: 5 },
    };

    const state = recipeReducer(stateWithRecipe, clearSelectedRecipe());

    expect(state.selectedRecipe).toBeNull();
    expect(state.comments).toEqual([]);
    expect(state.commentsPagination).toBeNull();
    expect(state.userRating).toBeNull();
  });

  it('should handle setComments', () => {
    const payload = {
      comments: [mockComment],
      pagination: {
        page: 1,
        totalPages: 1,
        totalComments: 1,
        hasNext: false,
        hasPrev: false,
        limit: 10,
      },
    };

    const state = recipeReducer({ ...initialState, commentsLoading: true }, setComments(payload));

    expect(state.comments).toEqual([mockComment]);
    expect(state.commentsPagination).toEqual(payload.pagination);
    expect(state.commentsLoading).toBe(false);
  });

  it('should handle addComment', () => {
    const newComment: Comment = {
      id: 'comment2',
      content: 'Another great recipe!',
      author: { id: 'user2', name: 'Another User', email: 'another@test.com' },
      authorId: 'user2',
      recipe: '1',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02',
    };

    const stateWithComments = {
      ...initialState,
      comments: [mockComment],
      commentsPagination: {
        page: 1,
        totalPages: 1,
        totalComments: 1,
        hasNext: false,
        hasPrev: false,
        limit: 10,
      },
    };

    const state = recipeReducer(stateWithComments, addComment(newComment));

    expect(state.comments).toHaveLength(2);
    expect(state.comments[0]).toEqual(newComment);
    expect(state.commentsPagination?.totalComments).toBe(2);
  });

  it('should handle updateRecipeRating', () => {
    const stateWithRecipe = {
      ...initialState,
      selectedRecipe: mockRecipeDetail,
    };

    const action = {
      type: 'recipes/updateRecipeRating',
      payload: { averageRating: 4.8, ratingCount: 10 },
    };

    const state = recipeReducer(stateWithRecipe, action);

    expect(state.selectedRecipe?.averageRating).toBe(4.8);
    expect(state.selectedRecipe?.ratingCount).toBe(10);
  });

  it('should handle setUserRating', () => {
    const userRating = { recipeId: '1', value: 5 };
    const action = {
      type: 'recipes/setUserRating',
      payload: userRating,
    };

    const state = recipeReducer(initialState, action);

    expect(state.userRating).toEqual(userRating);
  });

  it('should handle clearUserRating', () => {
    const stateWithRating = {
      ...initialState,
      userRating: { recipeId: '1', value: 5 },
    };

    const action = { type: 'recipes/clearUserRating' };
    const state = recipeReducer(stateWithRating, action);

    expect(state.userRating).toBeNull();
  });
});
