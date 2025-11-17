import { TIngredient } from '@utils-types';

export type ConstructorPageUIProps = {
  isIngredientsLoading: boolean;
  onAddIngredient: (ingredient: TIngredient) => void;
};
