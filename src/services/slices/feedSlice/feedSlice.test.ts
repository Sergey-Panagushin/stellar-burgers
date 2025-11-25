import { describe, expect, test } from '@jest/globals';
import { feedReducer, getFeeds, clearFeedError } from './feedSlice';

describe('feed reducer', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  test('должен возвращать начальное состояние', () => {
    const result = feedReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  test('должен очищать ошибку', () => {
    const state = { ...initialState, error: 'Ошибка' };
    const result = feedReducer(state, clearFeedError());
    expect(result.error).toBeNull();
  });

  test('должен начинать загрузку', () => {
    const action = { type: getFeeds.pending.type };
    const result = feedReducer(initialState, action);
    expect(result.loading).toBe(true);
  });

  test('должен заканчивать загрузку с данными', () => {
    const state = { ...initialState, loading: true };
    const action = {
      type: getFeeds.fulfilled.type,
      payload: { orders: [], total: 100, totalToday: 10 }
    };
    const result = feedReducer(state, action);
    expect(result.loading).toBe(false);
    expect(result.total).toBe(100);
  });

  test('должен обрабатывать ошибку загрузки', () => {
    const state = { ...initialState, loading: true };
    const action = {
      type: getFeeds.rejected.type,
      error: { message: 'Ошибка' }
    };
    const result = feedReducer(state, action);
    expect(result.loading).toBe(false);
    expect(result.error).toBe('Ошибка');
  });
});
