import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '@ui';
import { OrderInfoUI } from '../ui/order-info';

import { TIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/ingredientsSlice';

import {
  getOrderByNumber,
  selectFeedOrders,
  selectSelectedOrder
} from '../../services/feedSlice';

import { selectProfileOrders } from '../../services/profileOrdersSlice';

type TOrderInfoProps = {
  isModal?: boolean;
};

export const OrderInfo: FC<TOrderInfoProps> = ({ isModal = false }) => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const selectedOrder = useSelector(selectSelectedOrder);
  const ingredients = useSelector(selectIngredients);

  const orderFromFeed = feedOrders.find(
    (order) => order.number === Number(number)
  );

  const orderFromProfile = profileOrders.find(
    (order) => order.number === Number(number)
  );

  const orderData = orderFromFeed || orderFromProfile || selectedOrder;

  useEffect(() => {
    if (!orderFromFeed && !orderFromProfile && number) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orderFromFeed, orderFromProfile]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const ingredientsInfo: {
      [key: string]: TIngredient & { count: number };
    } = {};

    orderData.ingredients.forEach((id) => {
      const ingredient = ingredients.find((item) => item._id === id);

      if (!ingredient) {
        return;
      }

      if (ingredientsInfo[id]) {
        ingredientsInfo[id].count += 1;
      } else {
        ingredientsInfo[id] = {
          ...ingredient,
          count: 1
        };
      }
    });

    const total = Object.values(ingredientsInfo).reduce(
      (sum, ingredient) => sum + ingredient.price * ingredient.count,
      0
    );

    const date = new Date(orderData.createdAt);

    return {
      ...orderData,
      ingredientsInfo,
      total,
      date
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return (
    <>
      {!isModal && (
        <p className='text text_type_digits-default mb-10'>
          #{orderInfo.number}
        </p>
      )}

      <OrderInfoUI orderInfo={orderInfo} />
    </>
  );
};
