import { RootState } from '../store';

export const getUser = (state: RootState) => state.user.user;
export const getUserLoading = (state: RootState) => state.user.loading;
export const getUserError = (state: RootState) => state.user.error;
export const getIsAuthChecked = (state: RootState) => state.user.isAuthChecked;
export const getIsAuthenticated = (state: RootState) => !!state.user.user;
