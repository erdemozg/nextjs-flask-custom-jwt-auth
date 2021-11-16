import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./user";

/**
 * out store object to handle client-side global state.
 * currently only contains user state.
 */
export const store = configureStore({
    reducer: {
        user: userReducer,
    },
});