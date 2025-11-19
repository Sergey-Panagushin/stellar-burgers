import { RootState } from '../store';
import { TIngredient } from '../../utils/types';
import { createSelector } from '@reduxjs/toolkit';

export const getConstructorItems = createSelector(
  [
    (state: RootState) => state.burgerConstructor?.bun,
    (state: RootState) => state.burgerConstructor?.ingredients
  ],
  (bun, ingredients) => ({
    bun: bun || null,
    ingredients: ingredients || []
  })
);

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
