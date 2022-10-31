import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  token: "",
};

export const userData = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { 
  setUserInfo,
  setToken,
} = userData.actions;
export const getUserInfo = (state) => state.userData.userInfo;
export const getToken = (state) => state.userData.token;





export default userData.reducer;
