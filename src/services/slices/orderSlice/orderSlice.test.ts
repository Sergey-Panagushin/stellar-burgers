import { describe, expect, test } from '@jest/globals';
import { orderReducer, createOrder, clearOrder } from './orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '1',
  status: 'done',
  name: 'Test Order',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['ing1', 'ing2']
};

describe('order reducer', () => {
  const initialState = {
    order: null,
    orderRequest: false,
    orderModalData: null,
    error: null,
    currentOrder: null,
    currentOrderLoading: false,
    currentOrderError: null
  };

  test('должен возвращать начальное состояние', () => {
    const result = orderReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  test('должен очищать заказ', () => {
    const state = {
      ...initialState,
      order: mockOrder,
      error: 'Ошибка'
    };
    const result = orderReducer(state, clearOrder());
    expect(result.order).toBeNull();
    expect(result.error).toBeNull();
  });

  test('должен начинать создание заказа', () => {
    const action = { type: createOrder.pending.type };
    const result = orderReducer(initialState, action);
    expect(result.orderRequest).toBe(true);
  });

  test('должен создавать заказ', () => {
    const state = { ...initialState, orderRequest: true };
    const action = {
      type: createOrder.fulfilled.type,
      payload: { order: mockOrder }
    };
    const result = orderReducer(state, action);
    expect(result.orderRequest).toBe(false);
    expect(result.order?.number).toBe(12345);
  });

  test('должен обрабатывать ошибку создания заказа', () => {
    const state = { ...initialState, orderRequest: true };
    const action = {
      type: createOrder.rejected.type,
      error: { message: 'Ошибка' }
    };
    const result = orderReducer(state, action);
    expect(result.orderRequest).toBe(false);
    expect(result.error).toBe('Ошибка');
  });
});
