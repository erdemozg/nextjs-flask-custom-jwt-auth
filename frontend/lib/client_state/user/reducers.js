import { createReducer } from "@reduxjs/toolkit";

import {
    setUser,
    clearUser,
} from './actions';

const initialState = {
    user: {
        id: null,
        username: null,
        access_token: null
    },
};

/**
 * reducer to manage user state.
 */
export const userReducer = createReducer(initialState, builder => {
    builder
        .addCase(setUser, (state, action) => {
            state.user = { ...action.payload };
        })
        .addCase(clearUser, state => {
            state.user = initialState.user;
        });
});