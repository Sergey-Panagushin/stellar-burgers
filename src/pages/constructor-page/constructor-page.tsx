import { useSelector, useDispatch } from '../../services/store';
import { addIngredient } from '../../services/slices/burgerConstructorSlice';
import { getIngredientsLoading } from '../../services/selectors/ingredientsSelectors';
import { TIngredient } from '@utils-types';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const isIngredientsLoading = useSelector(getIngredientsLoading);

  const handleAddIngredient = (ingredient: TIngredient) => {
    dispatch(addIngredient(ingredient));
  };

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients onAddIngredient={handleAddIngredient} />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
