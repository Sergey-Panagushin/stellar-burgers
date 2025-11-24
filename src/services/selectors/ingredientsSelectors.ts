import { RootState } from '../store';

export const getIngredientsState = (state: RootState) => state.ingredients;
export const getIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const getIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
