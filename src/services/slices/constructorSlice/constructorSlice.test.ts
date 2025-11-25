import { describe, expect, test } from '@jest/globals';
import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

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

describe('constructor reducer', () => {
  const initialState = {
    bun: null as TIngredient | null,
    ingredients: [] as TConstructorIngredient[]
  };

  describe('начальное состояние', () => {
    test('должен возвращать начальное состояние при неизвестном экшене', () => {
      const result = constructorReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result).toEqual(initialState);
    });
  });

  describe('добавление ингредиентов', () => {
    test('должен добавлять булку с уникальным id', () => {
      const action = addIngredient(mockBun);
      const result = constructorReducer(initialState, action);

      expect(result.bun).toBeDefined();
      expect(result.bun).toMatchObject({
        ...mockBun,
        id: expect.stringMatching(`${mockBun._id}-\\d+`)
      });
      expect(result.ingredients).toHaveLength(0);
    });

    test('должен добавлять начинку с уникальным id', () => {
      const action = addIngredient(mockFilling);
      const result = constructorReducer(initialState, action);

      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]).toMatchObject({
        ...mockFilling,
        id: expect.stringMatching(`${mockFilling._id}-\\d+`)
      });
    });

    test('должен заменять старую булку при добавлении новой', () => {
      let state = constructorReducer(initialState, addIngredient(mockBun));
      const newBun: TIngredient = {
        ...mockBun,
        _id: '60d3b41abdacab0026a733c7',
        name: 'Флюоресцентная булка R2-D3'
      };

      state = constructorReducer(state, addIngredient(newBun));

      expect(state.bun).toMatchObject({
        ...newBun,
        id: expect.stringMatching(`${newBun._id}-\\d+`)
      });
      expect(state.ingredients).toHaveLength(0);
    });

    test('должен добавлять несколько начинок', () => {
      let state = constructorReducer(initialState, addIngredient(mockFilling));
      state = constructorReducer(state, addIngredient(mockFilling2));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]).toMatchObject({
        ...mockFilling,
        id: expect.stringMatching(`${mockFilling._id}-\\d+`)
      });
      expect(state.ingredients[1]).toMatchObject({
        ...mockFilling2,
        id: expect.stringMatching(`${mockFilling2._id}-\\d+`)
      });
    });
  });

  describe('удаление ингредиентов', () => {
    test('должен удалять начинку по id', () => {
      let state = constructorReducer(initialState, addIngredient(mockFilling));
      state = constructorReducer(state, addIngredient(mockFilling2));

      const fillingId = state.ingredients[0].id;

      const action = removeIngredient(fillingId);
      state = constructorReducer(state, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).not.toBe(fillingId);
    });

    test('не должен удалять начинку при неверном id', () => {
      let state = constructorReducer(initialState, addIngredient(mockFilling));
      const initialIngredientsLength = state.ingredients.length;

      const action = removeIngredient('wrong-id');
      state = constructorReducer(state, action);

      expect(state.ingredients).toHaveLength(initialIngredientsLength);
    });
  });

  describe('перемещение ингредиентов', () => {
    test('должен перемещать ингредиент на другую позицию', () => {
      let state = constructorReducer(initialState, addIngredient(mockFilling));
      state = constructorReducer(state, addIngredient(mockFilling2));

      const [firstId, secondId] = state.ingredients.map((item) => item.id);

      const action = moveIngredient({ from: 1, to: 0 });
      const result = constructorReducer(state, action);

      expect(result.ingredients[0].id).toBe(secondId);
      expect(result.ingredients[1].id).toBe(firstId);
    });

    test('не должен менять порядок при перемещении на ту же позицию', () => {
      let state = constructorReducer(initialState, addIngredient(mockFilling));
      state = constructorReducer(state, addIngredient(mockFilling2));

      const initialOrder = state.ingredients.map((item) => item.id);

      const action = moveIngredient({ from: 0, to: 0 });
      const result = constructorReducer(state, action);

      expect(result.ingredients.map((item) => item.id)).toEqual(initialOrder);
    });
  });

  describe('очистка конструктора', () => {
    test('должен очищать все ингредиенты из конструктора', () => {
      let state = constructorReducer(initialState, addIngredient(mockBun));
      state = constructorReducer(state, addIngredient(mockFilling));
      state = constructorReducer(state, addIngredient(mockFilling2));

      const action = clearConstructor();
      const result = constructorReducer(state, action);

      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(0);
    });

    test('должен очищать пустой конструктор без ошибок', () => {
      const action = clearConstructor();
      const result = constructorReducer(initialState, action);

      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(0);
    });
  });
});
