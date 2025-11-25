import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getOrders } from '../../services/slices/ordersSlice/ordersSlice';
import { getOrdersList } from '../../services/selectors/ordersSelectors';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(getOrdersList);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
