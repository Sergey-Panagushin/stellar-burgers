import { FC } from 'react';
import { useSelector } from '../../services/store';
import { FeedInfoUI } from '../ui/feed-info';
import {
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday
} from '../../services/selectors/feedSelectors';
import { TOrder } from '@utils-types';

type TOrderStatus = 'done' | 'pending' | 'created';

const getOrders = (orders: TOrder[], status: TOrderStatus): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders: TOrder[] = useSelector(getFeedOrders);
  const total: number = useSelector(getFeedTotal);
  const totalToday: number = useSelector(getFeedTotalToday);

  const feed = {
    total,
    totalToday
  };

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
