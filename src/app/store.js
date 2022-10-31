import { configureStore } from "@reduxjs/toolkit";
import userData from "../data/userData";

export default configureStore({
  reducer: {
    userData: userData
  }
})