import getConfig from "next/config";
import Router from "next/router";
import { fetchWrapper } from "../network/fetch-wrapper";
import { store } from "../client_state/store";
import { setUser, clearUser } from "../client_state/user";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

/**
 * contains methods related to user authentication.
 * some methods act as a middleware between components and the fetchWrapper to manage client-side user state
 */
export const authService = {
  login,
  refreshToken,
  logout,
  signUp,
};

function login(username, password) {
  return fetchWrapper.post(`${baseUrl}/login`, { username, password })
    .then((user) => {
      store.dispatch(setUser(user));
      return user;
    });
}

function logout() {
  return fetchWrapper.get(`${baseUrl}/logout`)
    .then((resp) => {
        store.dispatch(clearUser());
        Router.push("/");
    });
}

function refreshToken() {
  return fetchWrapper.get(`${baseUrl}/refresh_token`)
    .then((user) => {
        store.dispatch(setUser(user));
        return user;
    });
}

function signUp(username, password) {
  return fetchWrapper.post(`${baseUrl}/signup`, { username, password })
    .then((result) => {
      return result;
    });
}
