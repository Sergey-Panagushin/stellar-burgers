import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../../utils/burger-api';
import { TOrder } from '../../../utils/types';

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  async (orderNumber: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(orderNumber);
      return response.orders[0];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

type TOrderState = {
  order: TOrder | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
  currentOrder: TOrder | null;
  currentOrderLoading: boolean;
  currentOrderError: string | null;
};

const initialState: TOrderState = {
  order: null,
  orderRequest: false,
  orderModalData: null,
  error: null,
  currentOrder: null,
  currentOrderLoading: false,
  currentOrderError: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.orderModalData = null;
      state.error = null;
    },
    closeOrderModal: (state) => {
      state.orderModalData = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.currentOrderLoading = false;
      state.currentOrderError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.order = action.payload.order;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка оформления заказа';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.currentOrderLoading = true;
        state.currentOrderError = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrder = action.payload;
        state.currentOrderError = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrderError =
          action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrder, closeOrderModal, clearCurrentOrder } =
  orderSlice.actions;
export const orderReducer = orderSlice.reducer;
