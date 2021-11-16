import { createAction} from "@reduxjs/toolkit";

/**
 * user state actions.
 */
export const setUser = createAction("user/setUser");
export const clearUser = createAction("user/clearUser");