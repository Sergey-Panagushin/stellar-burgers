import { TIngredient } from '@utils-types';

export type TBurgerIngredientProps = {
  ingredient: TIngredient;
  count: number;
  onAddIngredient: (ingredient: TIngredient) => void;
};
