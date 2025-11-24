import React, { forwardRef } from 'react';
import { BurgerIngredient } from '@components';
import { TIngredientsCategoryUIProps } from './type';
import styles from './ingredients-category.module.css';

export const IngredientsCategoryUI = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryUIProps
>(
  (
    { title, titleRef, ingredients, ingredientsCounters, onAddIngredient },
    ref
  ) => (
    <>
      <h2 className='text text_type_main-medium mt-10' ref={titleRef}>
        {title}
      </h2>
      <ul className={`${styles.items} mt-6 ml-4 mr-2`} ref={ref}>
        {ingredients.map((ingredient) => (
          <BurgerIngredient
            key={ingredient._id}
            ingredient={ingredient}
            count={ingredientsCounters[ingredient._id]}
            onAddIngredient={onAddIngredient}
          />
        ))}
      </ul>
    </>
  )
);
