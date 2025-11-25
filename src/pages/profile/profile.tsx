import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  updateUser,
  clearError
} from '../../services/slices/userSlice/userSlice';
import {
  getUser,
  getUserError,
  getUserLoading
} from '../../services/selectors/userSelectors';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const updateUserError = useSelector(getUserError);
  const loading = useSelector(getUserLoading);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    const nameChanged = formValue.name !== user?.name;
    const emailChanged = formValue.email !== user?.email;
    const passwordChanged = !!formValue.password;

    setIsFormChanged(nameChanged || emailChanged || passwordChanged);
  }, [formValue, user]);

  useEffect(() => {
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  }, [user]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isFormChanged) return;

    dispatch(clearError());

    const updateData: { name?: string; email?: string; password?: string } = {};

    if (formValue.name !== user?.name) {
      updateData.name = formValue.name;
    }

    if (formValue.email !== user?.email) {
      updateData.email = formValue.email;
    }

    if (formValue.password) {
      updateData.password = formValue.password;
    }

    dispatch(updateUser(updateData));

    if (formValue.password) {
      setFormValue((prev) => ({
        ...prev,
        password: ''
      }));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();

    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });

    dispatch(clearError());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={updateUserError || ''}
    />
  );
};
