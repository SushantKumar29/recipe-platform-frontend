import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('*/auth/login', () => {
    return HttpResponse.json({
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      token: 'fake-jwt-token',
    });
  }),

  http.post('*/auth/signup', () => {
    return HttpResponse.json({
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      token: 'fake-jwt-token',
    });
  }),

  http.get('*/recipes', () => {
    return HttpResponse.json({
      data: [
        {
          id: '1',
          title: 'Test Recipe',
          ingredients: ['Ingredient 1', 'Ingredient 2'],
          steps: ['Step 1', 'Step 2'],
          author: {
            id: 'user1',
            name: 'Test User',
            email: 'test@example.com',
          },
          isPublished: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          ratingCount: 5,
          averageRating: 4.5,
          preparationTime: 30,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        pages: 1,
      },
    });
  }),

  http.get('*/recipes/:id', ({ params }: { params: { id: string } }) => {
    const { id } = params;
    return HttpResponse.json({
      id: id,
      title: 'Test Recipe Detail',
      ingredients: ['Ingredient 1', 'Ingredient 2'],
      steps: ['Step 1', 'Step 2'],
      author: { id: 'user1', name: 'Test User', email: 'test@example.com' },
      isPublished: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      ratingCount: 5,
      averageRating: 4.5,
      preparationTime: 30,
      ratings: [],
    });
  }),

  http.post('*/recipes', () => {
    return HttpResponse.json({
      id: 'new-recipe-id',
      title: 'New Recipe',
      message: 'Recipe created successfully',
    });
  }),

  http.put('*/recipes/:id', () => {
    return HttpResponse.json({
      message: 'Recipe updated successfully',
    });
  }),

  http.delete('*/recipes/:id', () => {
    return HttpResponse.json({
      message: 'Recipe deleted successfully',
    });
  }),

  http.get('*/recipes/:id/comments', () => {
    return HttpResponse.json({
      comments: [
        {
          id: 'comment1',
          content: 'Great recipe!',
          author: {
            id: 'user1',
            name: 'Test User',
            email: 'test@example.com',
          },
          recipe: '1',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ],
      pagination: {
        page: 1,
        totalPages: 1,
        totalComments: 1,
        hasNext: false,
        hasPrev: false,
        limit: 10,
      },
    });
  }),

  http.post('*/recipes/:id/comments', () => {
    return HttpResponse.json({
      comment: {
        id: 'new-comment',
        content: 'New comment',
        author: { id: 'user1', name: 'Test User', email: 'test@example.com' },
        recipe: '1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    });
  }),

  http.post('*/recipes/:id/rate', () => {
    return HttpResponse.json({
      averageRating: 4.5,
      ratingCount: 6,
      userRating: 5,
    });
  }),
];
