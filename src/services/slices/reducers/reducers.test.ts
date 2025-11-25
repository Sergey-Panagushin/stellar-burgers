import { describe, expect, test } from '@jest/globals';
import { rootReducer } from './reducers';

describe('rootReducer инициализация', () => {
  test('должен возвращать корректное начальное состояние при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('constructor');
    expect(initialState).toHaveProperty('order');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('orders');
  });
});
