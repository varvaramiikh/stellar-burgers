import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './burgerConstructorSlice';

const mockBun = {
  _id: 'bun-1',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 100,
  price: 1255,
  image: 'bun.png',
  image_mobile: 'bun-mobile.png',
  image_large: 'bun-large.png'
};

const mockMain = {
  _id: 'main-1',
  name: 'Тестовая начинка',
  type: 'main',
  proteins: 40,
  fat: 50,
  carbohydrates: 60,
  calories: 200,
  price: 424,
  image: 'main.png',
  image_mobile: 'main-mobile.png',
  image_large: 'main-large.png'
};

describe('burgerConstructorSlice', () => {
  test('возвращает initialState при UNKNOWN action', () => {
    const result = burgerConstructorReducer(undefined, { type: 'UNKNOWN' });

    expect(result).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('добавляет булку в constructor.bun', () => {
    const result = burgerConstructorReducer(
      {
        bun: null,
        ingredients: []
      },
      addIngredient(mockBun)
    );

    expect(result.bun).toMatchObject(mockBun);
    expect(result.bun?.id).toBeDefined();
    expect(result.ingredients).toEqual([]);
  });

  test('добавляет начинку в constructor.ingredients', () => {
    const result = burgerConstructorReducer(
      {
        bun: null,
        ingredients: []
      },
      addIngredient(mockMain)
    );

    expect(result.bun).toBeNull();
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toMatchObject(mockMain);
    expect(result.ingredients[0].id).toBeDefined();
  });

  test('удаляет ингредиент из constructor.ingredients', () => {
    const ingredientWithId = {
      ...mockMain,
      id: 'test-id-1'
    };

    const result = burgerConstructorReducer(
      {
        bun: null,
        ingredients: [ingredientWithId]
      },
      removeIngredient('test-id-1')
    );

    expect(result.ingredients).toEqual([]);
  });

  test('перемещает ингредиент вверх', () => {
    const firstIngredient = {
      ...mockMain,
      _id: 'main-1',
      name: 'Первая начинка',
      id: 'id-1'
    };

    const secondIngredient = {
      ...mockMain,
      _id: 'main-2',
      name: 'Вторая начинка',
      id: 'id-2'
    };

    const result = burgerConstructorReducer(
      {
        bun: null,
        ingredients: [firstIngredient, secondIngredient]
      },
      moveIngredient({ index: 1, direction: 'up' })
    );

    expect(result.ingredients[0].id).toBe('id-2');
    expect(result.ingredients[1].id).toBe('id-1');
  });

  test('перемещает ингредиент вниз', () => {
    const firstIngredient = {
      ...mockMain,
      _id: 'main-1',
      name: 'Первая начинка',
      id: 'id-1'
    };

    const secondIngredient = {
      ...mockMain,
      _id: 'main-2',
      name: 'Вторая начинка',
      id: 'id-2'
    };

    const result = burgerConstructorReducer(
      {
        bun: null,
        ingredients: [firstIngredient, secondIngredient]
      },
      moveIngredient({ index: 0, direction: 'down' })
    );

    expect(result.ingredients[0].id).toBe('id-2');
    expect(result.ingredients[1].id).toBe('id-1');
  });

  test('очищает конструктор', () => {
    const bunWithId = {
      ...mockBun,
      id: 'bun-id'
    };

    const ingredientWithId = {
      ...mockMain,
      id: 'main-id'
    };

    const result = burgerConstructorReducer(
      {
        bun: bunWithId,
        ingredients: [ingredientWithId]
      },
      clearConstructor()
    );

    expect(result).toEqual({
      bun: null,
      ingredients: []
    });
  });
});