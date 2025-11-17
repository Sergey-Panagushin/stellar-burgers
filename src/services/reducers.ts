import { combineReducers } from 'redux';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { userReducer } from './slices/userSlice';
import { constructorReducer } from './slices/constructorSlice';
import { orderReducer } from './slices/orderSlice';
import { feedReducer } from './slices/feedSlice';
import { burgerConstructorReducer } from './slices/burgerConstructorSlice';
import { ordersReducer } from './slices/ordersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  constructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
  burgerConstructor: burgerConstructorReducer,
  orders: ordersReducer
});
