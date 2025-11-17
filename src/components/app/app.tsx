import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { OrderDetails } from '../order-details/order-details';
import { IngredientDetails, Modal } from '@components';
import '../../index.css';
import styles from './app.module.css';
import { store, useDispatch, useSelector } from '../../services/store';
import { AppHeader } from '@components';
import { Provider } from 'react-redux';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useEffect } from 'react';
import { getUser } from '../../services/slices/userSlice';
import { getIsAuthChecked } from '../../services/selectors/userSelectors';

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthChecked = useSelector(getIsAuthChecked);
  const navigate = useNavigate();
  const location = useLocation();

  const background = location.state?.background;

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(getUser());
    }
  }, [dispatch, isAuthChecked]);

  const handleClose = () => {
    navigate(-1);
  };

  const getOrderNumberFromPath = (path: string) => {
    const match = path.match(/\/(\d+)$/);
    return match ? match[1] : null;
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

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

        <Route path='/feed/:number' element={<OrderDetails />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/profile/orders/:number' element={<OrderDetails />} />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${getOrderNumberFromPath(location.pathname)}`}
                onClose={handleClose}
              >
                <OrderDetails />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='' onClose={handleClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title={`#${getOrderNumberFromPath(location.pathname)}`}
                onClose={handleClose}
              >
                <OrderDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </Provider>
);

export default App;
