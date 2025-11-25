import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  updateUserApi
} from '../../../utils/burger-api';
import { TUser, TRegisterData, TLoginData } from '../../../utils/types';
import { setCookie, deleteCookie, getCookie } from '../../../utils/cookie';

const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return translateErrorMessage(error.message);
  }

  if (typeof error === 'string') {
    return translateErrorMessage(error);
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return translateErrorMessage(String(error.message));
  }

  if (error && typeof error === 'object') {
    return 'Ошибка сервера';
  }

  return 'Неизвестная ошибка';
};

const translateErrorMessage = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes('email or password are incorrect') ||
    lowerMessage.includes('invalid credentials')
  ) {
    return 'Неправильный email или пароль';
  }

  if (lowerMessage.includes('user already exists')) {
    return 'Пользователь с таким email уже существует';
  }

  if (lowerMessage.includes('email, name and password are required')) {
    return 'Все поля обязательны для заполнения';
  }

  if (lowerMessage.includes('invalid email')) {
    return 'Некорректный email';
  }

  if (lowerMessage.includes('password is too short')) {
    return 'Пароль слишком короткий';
  }

  if (
    lowerMessage.includes('you should be authorised') ||
    lowerMessage.includes('authorization required')
  ) {
    return 'Требуется авторизация';
  }

  if (
    lowerMessage.includes('jwt expired') ||
    lowerMessage.includes('token is invalid') ||
    lowerMessage.includes('jwt malformed')
  ) {
    return '';
  }

  if (lowerMessage.includes('ingredients must be provided')) {
    return 'Необходимо выбрать ингредиенты';
  }

  if (
    lowerMessage.includes('неверный') ||
    lowerMessage.includes('ошибка') ||
    lowerMessage.includes('неправильный')
  ) {
    return message;
  }

  return message;
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      setCookie('accessToken', response.accessToken.split('Bearer ')[1]);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      setCookie('accessToken', response.accessToken.split('Bearer ')[1]);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue, dispatch }) => {
    try {
      const token = getCookie('accessToken');
      if (!token) {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error('Токен не найден. Пожалуйста, войдите снова.');
      }

      const response = await updateUserApi(data);
      return response.user;
    } catch (error) {
      const errorMessage = handleApiError(error);

      if (
        errorMessage &&
        (errorMessage.includes('authorised') ||
          errorMessage.includes('authorized') ||
          errorMessage.includes('token'))
      ) {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get User
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.error = action.payload as string;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;

        const errorMessage = action.payload as string;
        if (
          errorMessage &&
          (errorMessage.includes('authorised') ||
            errorMessage.includes('authorized') ||
            errorMessage.includes('token'))
        ) {
          state.user = null;
          state.isAuthChecked = true;
        }
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const { clearError, setAuthChecked } = userSlice.actions;
export const userReducer = userSlice.reducer;
