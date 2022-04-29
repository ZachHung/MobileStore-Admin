import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  current: null,
  isFetching: false,
  error: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetching: (state) => {
      state.isFetching = true;
    },
    error: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    success: (state) => {
      state.isFetching = false;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.current = action.payload;
      state.isFetching = false;
      state.error = false;
    },
    loginFail: (state) => {
      state.error = true;
      state.isFetching = false;
    },
    logout: (state) => (state = initialState),
  },
});
export const { fetching, error, success, logout, loginFail, loginSuccess } =
  userSlice.actions;
export default userSlice.reducer;
