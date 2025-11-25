import { describe, expect, test } from '@jest/globals';
import {
  burgerConstructorReducer,
  addIngredient,
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient,
  clearConstructor
} from './burgerConstructorSlice';
import { createOrder } from '../orderSlice/orderSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: '60d3b41abdacab0026a733c6',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
};

const mockFilling: TIngredient = {
  _id: '60d3b41abdacab0026a733c8',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png'
};

const mockFilling2: TIngredient = {
  _id: '60d3b41abdacab0026a733c9',
  name: 'Мясо бессмертных моллюсков Protostomia',
  type: 'main',
  proteins: 433,
  fat: 244,
  carbohydrates: 33,
  calories: 420,
  price: 1337,
  image: 'https://code.s3.yandex.net/react/code/meat-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png'
};

describe('burgerConstructor reducer', () => {
  const initialState = {
    bun: null as TIngredient | null,
    ingredients: [] as TIngredient[]
  };

  describe('начальное состояние', () => {
    test('должен возвращать начальное состояние при неизвестном экшене', () => {
      const result = burgerConstructorReducer(undefined, {
        type: 'UNKNOWN_ACTION'
      });
      expect(result).toEqual(initialState);
    });
  });

  describe('добавление ингредиентов', () => {
    test('должен добавлять булку в конструктор', () => {
      const action = addIngredient(mockBun);
      const result = burgerConstructorReducer(initialState, action);

      expect(result.bun).toEqual(mockBun);
      expect(result.ingredients).toHaveLength(0);
    });

    test('должен добавлять начинку в конструктор', () => {
      const action = addIngredient(mockFilling);
      const result = burgerConstructorReducer(initialState, action);

      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]).toEqual(mockFilling);
    });

    test('должен заменять старую булку при добавлении новой', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockBun)
      );
      const newBun: TIngredient = {
        ...mockBun,
        _id: '60d3b41abdacab0026a733c7',
        name: 'Флюоресцентная булка R2-D3'
      };

      state = burgerConstructorReducer(state, addIngredient(newBun));

      expect(state.bun).toEqual(newBun);
      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('удаление ингредиентов', () => {
    test('должен удалять начинку по индексу', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockFilling)
      );
      state = burgerConstructorReducer(state, addIngredient(mockFilling2));

      expect(state.ingredients).toHaveLength(2);

      const action = removeIngredient(0);
      state = burgerConstructorReducer(state, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockFilling2);
    });

    test('не должен удалять начинку при неверном индексе', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockFilling)
      );
      const initialIngredientsLength = state.ingredients.length;

      const action = removeIngredient(5);
      state = burgerConstructorReducer(state, action);

      expect(state.ingredients).toHaveLength(initialIngredientsLength);
    });
  });

  describe('перемещение ингредиентов', () => {
    test('должен перемещать ингредиент вверх', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockFilling)
      );
      state = burgerConstructorReducer(state, addIngredient(mockFilling2));

      expect(state.ingredients[0]).toEqual(mockFilling);
      expect(state.ingredients[1]).toEqual(mockFilling2);

      const action = moveIngredientUp(1);
      state = burgerConstructorReducer(state, action);

      expect(state.ingredients[0]).toEqual(mockFilling2);
      expect(state.ingredients[1]).toEqual(mockFilling);
    });

    test('должен перемещать ингредиент вниз', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockFilling)
      );
      state = burgerConstructorReducer(state, addIngredient(mockFilling2));

      expect(state.ingredients[0]).toEqual(mockFilling);
      expect(state.ingredients[1]).toEqual(mockFilling2);

      const action = moveIngredientDown(0);
      state = burgerConstructorReducer(state, action);

      expect(state.ingredients[0]).toEqual(mockFilling2);
      expect(state.ingredients[1]).toEqual(mockFilling);
    });

    test('не должен перемещать первый ингредиент вверх', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockFilling)
      );
      state = burgerConstructorReducer(state, addIngredient(mockFilling2));

      const initialOrder = [...state.ingredients];

      const action = moveIngredientUp(0);
      state = burgerConstructorReducer(state, action);

      expect(state.ingredients).toEqual(initialOrder);
    });

    test('не должен перемещать последний ингредиент вниз', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockFilling)
      );
      state = burgerConstructorReducer(state, addIngredient(mockFilling2));

      const initialOrder = [...state.ingredients];

      const action = moveIngredientDown(1);
      state = burgerConstructorReducer(state, action);

      expect(state.ingredients).toEqual(initialOrder);
    });
  });

  describe('очистка конструктора', () => {
    test('должен очищать все ингредиенты из конструктора', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockBun)
      );
      state = burgerConstructorReducer(state, addIngredient(mockFilling));
      state = burgerConstructorReducer(state, addIngredient(mockFilling2));

      const action = clearConstructor();
      const result = burgerConstructorReducer(state, action);

      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(0);
    });
  });

  describe('дополнительные редьюсеры', () => {
    test('должен очищать конструктор при успешном создании заказа', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockBun)
      );
      state = burgerConstructorReducer(state, addIngredient(mockFilling));

      const mockOrderResponse = {
        success: true,
        order: {
          _id: '12345',
          status: 'done',
          name: 'Space бургер',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          number: 12345,
          ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733c8']
        },
        name: 'Space бургер'
      };

      const action = createOrder.fulfilled(mockOrderResponse, 'requestId', [
        mockBun._id,
        mockFilling._id
      ]);

      const result = burgerConstructorReducer(state, action);

      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(0);
    });
  });
});
