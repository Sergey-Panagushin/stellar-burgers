import { RootState } from '../store';
import { TIngredient } from '../../utils/types';

export const getConstructorItems = (state: RootState) => ({
  bun: state.burgerConstructor?.bun || null,
  ingredients: state.burgerConstructor?.ingredients || []
});

export const getConstructorBun = (state: RootState) =>
  state.burgerConstructor?.bun || null;

export const getConstructorIngredients = (state: RootState) =>
  state.burgerConstructor?.ingredients || [];

export const getConstructorPrice = (state: RootState) => {
  const constructor = state.burgerConstructor;

  const bun = constructor?.bun;
  const ingredients = constructor?.ingredients || [];

  const bunPrice = bun ? bun.price * 2 : 0;
  const ingredientsPrice = ingredients.reduce(
    (total: number, item: TIngredient) => total + (item?.price || 0),
    0
  );

  return bunPrice + ingredientsPrice;
};
