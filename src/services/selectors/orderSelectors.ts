import { RootState } from '../store';

export const getOrder = (state: RootState) => state.order.order;
export const getOrderRequest = (state: RootState) => state.order.orderRequest;
export const getOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const getOrderError = (state: RootState) => state.order.error;
