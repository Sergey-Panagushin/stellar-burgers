import { describe, expect, test, jest } from '@jest/globals';
import {
  ordersReducer,
  clearOrdersError,
  getOrders,
  initialState
} from './ordersSlice';
import { TOrder, TOrdersData } from '../../../utils/types';

jest.mock('../../../utils/burger-api', () => ({
  getOrdersApi: jest.fn()
}));

describe('ordersSlice тесты', () => {
  const mockOrders: TOrder[] = [
    {
      _id: '1',
      status: 'done',
      name: 'Order 1',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      number: 1,
      ingredients: ['ingredient1', 'ingredient2']
    },
    {
      _id: '2',
      status: 'pending',
      name: 'Order 2',
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
      number: 2,
      ingredients: ['ingredient3', 'ingredient4']
    }
  ];

  const mockOrdersData: TOrdersData = {
    orders: mockOrders,
    total: 100,
    totalToday: 5
  };

  describe('начальное состояние', () => {
    test('возвращает initialState', () => {
      const state = ordersReducer(undefined, { type: 'UNKNOWN_ACTION' });

      expect(state).toEqual(initialState);
    });
  });

  describe('clearOrdersError', () => {
    test('очищает ошибку', () => {
      const state = {
        ...initialState,
        error: 'Ошибка'
      };

      const newState = ordersReducer(state, clearOrdersError());

      expect(newState.error).toBeNull();
    });

    test('не меняет state если ошибки нет', () => {
      const state = {
        ...initialState,
        error: null
      };

      const newState = ordersReducer(state, clearOrdersError());

      expect(newState).toEqual(state);
    });
  });

  describe('getOrders', () => {
    test('loading true при начале загрузки', () => {
      const state = {
        ...initialState,
        error: null
      };

      const newState = ordersReducer(state, {
        type: getOrders.pending.type
      });

      expect(newState.loading).toBe(true);
    });

    test('loading false и orders обновляются при успехе', () => {
      const state = {
        ...initialState,
        error: null
      };

      const newState = ordersReducer(state, {
        type: getOrders.fulfilled.type,
        payload: mockOrdersData
      });

      expect(newState.loading).toBe(false);
      expect(newState.orders).toEqual(mockOrdersData);
    });
    test('loading false и error при ошибке', () => {
      const state = {
        ...initialState,
        error: null
      };

      const newState = ordersReducer(state, {
        type: getOrders.rejected.type,
        error: { message: 'Ошибка сети' }
      });

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Ошибка сети');
    });

    test('стандартная ошибка если message нет', () => {
      const state = {
        ...initialState,
        error: null
      };

      const newState = ordersReducer(state, {
        type: getOrders.rejected.type,
        error: { message: undefined }
      });

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Ошибка загрузки заказов');
    });
  });
});
