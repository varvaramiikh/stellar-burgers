import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './ingredientsSlice';
import burgerConstructorReducer from './burgerConstructorSlice';
import feedReducer from './feedSlice';
import userReducer from './userSlice';
import orderReducer from './orderSlice';
import profileOrdersReducer from './profileOrdersSlice';

const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    burgerConstructor: burgerConstructorReducer,
    feed: feedReducer,
    user: userReducer,
    order: orderReducer,
    profileOrders: profileOrdersReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
