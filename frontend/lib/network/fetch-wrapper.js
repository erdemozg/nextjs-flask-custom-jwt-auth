import getConfig from "next/config";
import { store } from "../client_state/store";
import { setUser, clearUser } from "../client_state/user";
import Router from "next/router";

const { publicRuntimeConfig } = getConfig();

/**
 * wrapper object that acts as a fetch middleware.
 * it gets access token from global state and adds authorization header to request (if it's a request to our backend api).
 * it can also detect if the current access token is expired.
 * in case of an expired access token, it seamlessly calls refresh token endpoint to get a new access token and store it in state.
 * after refreshing the access token it sends the original request and returns the response.
 * if there's a problem with the access token and it can't be refreshed, 
 * it's assumed as an unauthenticated request to a protected resource and the user is redirected to the login page.
 */
export const fetchWrapper = {
  get,
  post,
  put,
  delete: _delete,
};

// main http verbs

function get(url) {
  return makeRequest(url, "GET");
}

function post(url, body) {
  return makeRequest(url, "POST", body);
}

function put(url, body) {
  return makeRequest(url, "PUT", body);
}

function _delete(url) {
  return makeRequest(url, "DELETE");
}

// helper functions

function makeRequest(url, method, body = null) {

  const requestOptions = {
    method: method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(url),
    },
    body: body ? JSON.stringify(body) : null,
  };

  return fetch(url, requestOptions).then(async (response) => {
    const responseText = await response.text();
    const responseObject = isJsonString(responseText) ? JSON.parse(responseText) : null;
    if (response.ok) {
      return responseObject;
    } else {
      if (
        response.status == 401 &&
        responseObject &&
        responseObject.message &&
        responseObject.message == "access_token_invalid"
      ) {

        const refreshTokenResponse = await refreshTokenAndRetryRequest(url, requestOptions);

        if (refreshTokenResponse.ok) {
          return refreshTokenResponse.result;
        } else {
          if (refreshTokenResponse.redirectToLogin) {
            store.dispatch(clearUser());
            Router.push("/login");
          }
          return Promise.reject(refreshTokenResponse.result);
        }
      } else {
        const error = responseObject && responseObject.message 
          ? responseObject.message 
          : response.statusText;
        return Promise.reject(error);
      }
    }
  });
}

async function refreshTokenAndRetryRequest(mainRequestUrl, mainRequestOptions) {

  const refreshTokenRequestOptions = {
    method: "GET",
    credentials: "include",
  };

  const refreshTokenResponse = await fetch(`${publicRuntimeConfig.apiUrl}/refresh_token`, refreshTokenRequestOptions);
  const refreshTokenResponseText = await refreshTokenResponse.text();
  const refreshTokenResponseObject = isJsonString(refreshTokenResponseText) ? JSON.parse(refreshTokenResponseText) : null;

  if (refreshTokenResponse.ok) {
    if (refreshTokenResponseObject) {
      store.dispatch(setUser(refreshTokenResponseObject));
    }
    mainRequestOptions.headers = {
      ...mainRequestOptions.headers,
      Authorization: `Bearer ${refreshTokenResponseObject.access_token}`,
    };

    const mainRequestResponse = await fetch(mainRequestUrl, mainRequestOptions);
    const mainRequestResponseText = await mainRequestResponse.text();
    const mainRequestResponseObject = isJsonString(mainRequestResponseText) ? JSON.parse(mainRequestResponseText) : null;

    if (mainRequestResponse.ok) {

      return {
        ok: true,
        redirectToLogin: false,
        result: mainRequestResponseObject
      };
    } else {
      const error = mainRequestResponseObject && mainRequestResponseObject.message
        ? mainRequestResponseObject.message 
        : mainRequestResponse.statusText;

      return {
        ok: false,
        redirectToLogin: false,
        result: error
      };
    }
  } else {
    const error = refreshTokenResponse.statusText;

    return {
      ok: false,
      redirectToLogin: true,
      result: error
    };
  }
}

function authHeader(url) {
  
  const state = store.getState();
  const userState = state.user;
  const isAccessTokenPresent = userState && userState.user && userState.user.access_token;
  const isApiUrl = url.startsWith(publicRuntimeConfig.apiUrl);
  
  if (isAccessTokenPresent && isApiUrl) {
    return {
      Authorization: `Bearer ${userState.user.access_token}`,
    };
  } else {
    return {};
  }
}

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
