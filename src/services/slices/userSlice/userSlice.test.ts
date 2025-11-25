import { describe, expect, test } from '@jest/globals';
import { userReducer, loginUser, clearError } from './userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  name: 'Test User',
  email: 'test@test.com'
};

describe('user reducer', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    loading: false,
    error: null
  };

  test('должен возвращать начальное состояние', () => {
    const result = userReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  test('должен очищать ошибку', () => {
    const state = { ...initialState, error: 'Ошибка' };
    const result = userReducer(state, clearError());
    expect(result.error).toBeNull();
  });

  test('должен начинать вход пользователя', () => {
    const action = { type: loginUser.pending.type };
    const result = userReducer(initialState, action);
    expect(result.loading).toBe(true);
  });

  test('должен входить пользователя', () => {
    const state = { ...initialState, loading: true };
    const action = {
      type: loginUser.fulfilled.type,
      payload: mockUser
    };
    const result = userReducer(state, action);
    expect(result.loading).toBe(false);
    expect(result.user?.name).toBe('Test User');
    expect(result.isAuthChecked).toBe(true);
  });

  test('должен обрабатывать ошибку входа', () => {
    const state = { ...initialState, loading: true };
    const action = {
      type: loginUser.rejected.type,
      payload: 'Неправильный пароль'
    };
    const result = userReducer(state, action);
    expect(result.loading).toBe(false);
    expect(result.error).toBe('Неправильный пароль');
  });
});
