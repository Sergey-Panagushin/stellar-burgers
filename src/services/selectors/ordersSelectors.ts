import { RootState } from '../store';

export const getOrdersList = (state: RootState) => state.orders.orders;
export const getOrdersLoading = (state: RootState) => state.orders.loading;
export const getOrdersError = (state: RootState) => state.orders.error;
