import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds } from '../../services/slices/feedSlice/feedSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice/ingredientsSlice';
import {
  getFeedOrders,
  getFeedLoading
} from '../../services/selectors/feedSelectors';
import { RootState } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(getFeedOrders);
  const loading = useSelector(getFeedLoading);

  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }

    dispatch(getFeeds());
  }, [dispatch, ingredients.length]);

  const handleGetFeeds = () => {
    dispatch(getFeeds());
  };

  if (loading && orders.length === 0) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
