import { combineReducers } from 'redux';
import { ingredientsReducer } from '../ingredientsSlice/ingredientsSlice';
import { userReducer } from '../userSlice/userSlice';
import { constructorReducer } from '../constructorSlice/constructorSlice';
import { orderReducer } from '../orderSlice/orderSlice';
import { feedReducer } from '../feedSlice/feedSlice';
import { burgerConstructorReducer } from '../burgerConstructorSlice/burgerConstructorSlice';
import { ordersReducer } from '../ordersSlice/ordersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  constructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
  burgerConstructor: burgerConstructorReducer,
  orders: ordersReducer
});
