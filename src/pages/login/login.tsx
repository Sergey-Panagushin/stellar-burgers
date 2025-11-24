import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { loginUser, clearError } from '../../services/slices/userSlice';
import {
  getUserError,
  getIsAuthenticated
} from '../../services/selectors/userSelectors';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector(getUserError);
  const isAuthenticated = useSelector(getIsAuthenticated);

  const from = location.state?.from || { pathname: '/' };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
