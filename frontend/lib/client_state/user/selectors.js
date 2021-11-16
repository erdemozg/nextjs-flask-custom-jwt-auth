import { createSelector } from "@reduxjs/toolkit";

/**
 * user state selector.
 */
export const selectUser = state => state.user.user;
export const userSelector = createSelector(selectUser, state => state);