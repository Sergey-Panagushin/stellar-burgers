import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrderByNumber,
  clearCurrentOrder
} from '../../services/slices/orderSlice';
import { Preloader } from '../ui/preloader';
import { OrderInfo } from '../order-info';
import { RootState } from '../../services/store';

export const OrderDetails: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const { currentOrder, currentOrderLoading, currentOrderError } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumber(parseInt(number)));
    }

    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [number, dispatch]);

  if (currentOrderLoading) {
    return <Preloader />;
  }

  if (currentOrderError) {
    return (
      <div className='text text_type_main-default'>
        Ошибка: {currentOrderError}
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className='text text_type_main-default'>
        Заказ #{number} не найден
      </div>
    );
  }

  return <OrderInfo />;
};
