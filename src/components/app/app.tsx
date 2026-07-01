import '../../index.css';
import styles from './app.module.css';

import { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';

import { Preloader } from '@ui';

import { useDispatch, useSelector } from '../../services/store';

import {
  getIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '../../services/ingredientsSlice';

import { checkUserAuth, selectIsAuthChecked } from '../../services/userSlice';

type TOrderInfoModalProps = {
  onClose: () => void;
};

const OrderInfoModal = ({ onClose }: TOrderInfoModalProps) => {
  const { number } = useParams();

  return (
    <Modal title={`#${number}`} onClose={onClose}>
      <OrderInfo isModal />
    </Modal>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const background = location.state?.background;

  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      {isIngredientsLoading || !isAuthChecked ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : (
        <>
          <Routes location={background || location}>
            <Route path='/' element={<ConstructorPage />} />

            <Route path='/feed' element={<Feed />} />

            <Route path='/feed/:number' element={<OrderInfo />} />

            <Route path='/ingredients/:id' element={<IngredientDetails />} />

            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />

            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />

            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />

            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {background && (
            <Routes>
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                    <IngredientDetails />
                  </Modal>
                }
              />

              <Route
                path='/feed/:number'
                element={<OrderInfoModal onClose={handleCloseModal} />}
              />

              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute>
                    <OrderInfoModal onClose={handleCloseModal} />
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
