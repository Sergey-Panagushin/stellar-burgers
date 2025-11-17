import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';

export const OrderInfo: FC = () => {
  const orderData = useSelector((state: any) => state.order.currentOrder);
  const ingredients: TIngredient[] = useSelector(
    (state: any) => state.ingredients.ingredients
  );

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo: { [key: string]: any } = {};

    orderData.ingredients.forEach((item: string) => {
      if (!ingredientsInfo[item]) {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          ingredientsInfo[item] = {
            ...ingredient,
            count: 1
          };
        }
      } else {
        ingredientsInfo[item].count++;
      }
    });

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: any) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
