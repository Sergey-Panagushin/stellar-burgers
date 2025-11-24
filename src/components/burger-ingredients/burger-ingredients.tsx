import { useState, useRef, useEffect, FC, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from '../../services/store';
import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import {
  getIngredients,
  getIngredientsLoading
} from '../../services/selectors/ingredientsSelectors';
import { Preloader } from '@ui';

interface BurgerIngredientsProps {
  onAddIngredient: (ingredient: TIngredient) => void;
}

export const BurgerIngredients: FC<BurgerIngredientsProps> = ({
  onAddIngredient
}) => {
  const dispatch = useDispatch();
  const ingredients = useSelector(getIngredients);
  const loading = useSelector(getIngredientsLoading);

  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!hasFetched && ingredients.length === 0 && !loading) {
      dispatch(fetchIngredients());
      setHasFetched(true);
    }
  }, [dispatch, hasFetched, ingredients.length, loading]);

  const buns = useCallback(
    () => ingredients.filter((item: TIngredient) => item.type === 'bun'),
    [ingredients]
  )();

  const mains = useCallback(
    () => ingredients.filter((item: TIngredient) => item.type === 'main'),
    [ingredients]
  )();

  const sauces = useCallback(
    () => ingredients.filter((item: TIngredient) => item.type === 'sauce'),
    [ingredients]
  )();

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = useCallback((tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  if (loading && ingredients.length === 0) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          border: '1px solid #4C4CFF',
          borderRadius: '8px',
          margin: '20px'
        }}
      >
        <Preloader />
        <p>Пожалуйста, подождите</p>
      </div>
    );
  }

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
      onAddIngredient={onAddIngredient}
    />
  );
};
