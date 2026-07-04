import ingredientsReducer, { getIngredients } from './ingredientsSlice';

describe('ingredientsSlice', () => {
  test('возвращает initialState при UNKNOWN action', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  test('обрабатывает getIngredients.pending', () => {
    const result = ingredientsReducer(
      {
        ingredients: [],
        isLoading: false,
        error: null
      },
      getIngredients.pending('')
    );

    expect(result).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  test('обрабатывает getIngredients.fulfilled', () => {
    const mockIngredients = [
      {
        _id: 'test-bun-1',
        name: 'Тестовая булка',
        type: 'bun',
        proteins: 10,
        fat: 20,
        carbohydrates: 30,
        calories: 100,
        price: 1255,
        image: 'image.png',
        image_mobile: 'image-mobile.png',
        image_large: 'image-large.png'
      }
    ];

    const result = ingredientsReducer(
      {
        ingredients: [],
        isLoading: true,
        error: null
      },
      getIngredients.fulfilled(mockIngredients, '')
    );

    expect(result).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  test('обрабатывает getIngredients.rejected', () => {
    const error = new Error('Ошибка загрузки ингредиентов');

    const result = ingredientsReducer(
      {
        ingredients: [],
        isLoading: true,
        error: null
      },
      getIngredients.rejected(error, '')
    );

    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка загрузки ингредиентов'
    });
  });
});