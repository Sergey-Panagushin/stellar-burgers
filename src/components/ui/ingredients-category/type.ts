import { TIngredient } from '@utils-types';

export type TIngredientsCategoryUIProps = {
  title: string;
  titleRef: React.RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
  onAddIngredient: (ingredient: TIngredient) => void;
  ingredientsCounters: Record<string, number>;
};
