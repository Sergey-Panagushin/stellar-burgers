import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { getConstructorItems } from '../../services/selectors/constructorSelectors';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients, onAddIngredient }, ref) => {
  const constructorItems = useSelector(getConstructorItems);

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients: constructorIngredients = [] } = constructorItems;

    const counters: { [key: string]: number } = {};

    constructorIngredients.forEach((ingredient: TIngredient) => {
      if (ingredient && ingredient._id) {
        if (!counters[ingredient._id]) counters[ingredient._id] = 0;
        counters[ingredient._id]++;
      }
    });

    if (bun && bun._id) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [constructorItems]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
      onAddIngredient={onAddIngredient}
    />
  );
});
