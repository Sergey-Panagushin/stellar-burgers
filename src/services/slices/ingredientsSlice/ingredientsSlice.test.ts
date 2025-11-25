import { describe, expect, test } from '@jest/globals';
import {
  ingredientsReducer,
  fetchIngredients,
  clearError
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
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
  },
  {
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
  }
];

describe('ingredients reducer', () => {
  const initialState = {
    ingredients: [] as TIngredient[],
    loading: false,
    error: null as string | null
  };

  describe('начальное состояние', () => {
    test('должен возвращать начальное состояние при неизвестном экшене', () => {
      const result = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result).toEqual(initialState);
    });
  });

  describe('очистка ошибки', () => {
    test('должен очищать ошибку при dispatch clearError', () => {
      const stateWithError = {
        ingredients: [],
        loading: false,
        error: 'Какая-то ошибка'
      };

      const action = clearError();
      const result = ingredientsReducer(stateWithError, action);

      expect(result.error).toBeNull();
    });
  });

  describe('асинхронные экшены загрузки ингредиентов', () => {
    test('должен устанавливать loading в true при начале загрузки', () => {
      const action = { type: fetchIngredients.pending.type };
      const result = ingredientsReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.ingredients).toEqual([]);
    });

    test('должен устанавливать loading в false и обновлять ингредиенты при успешной загрузке', () => {
      const loadingState = {
        ingredients: [],
        loading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const result = ingredientsReducer(loadingState, action);

      expect(result.loading).toBe(false);
      expect(result.ingredients).toEqual(mockIngredients);
      expect(result.error).toBeNull();
    });

    test('должен устанавливать loading в false и обновлять ошибку при ошибке загрузки', () => {
      const loadingState = {
        ingredients: [],
        loading: true,
        error: null
      };

      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: fetchIngredients.rejected.type,
        payload: errorMessage
      };
      const result = ingredientsReducer(loadingState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.ingredients).toEqual([]);
    });
  });
});
