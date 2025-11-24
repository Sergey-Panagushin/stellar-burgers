import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { registerUser, clearError } from '../../services/slices/userSlice';
import {
  getUserError,
  getIsAuthenticated
} from '../../services/selectors/userSelectors';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(getUserError);
  const isAuthenticated = useSelector(getIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(registerUser({ email, name: userName, password }));
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
