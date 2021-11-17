import getConfig from "next/config";
import { fetchWrapper } from "../network/fetch-wrapper";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

/**
 * contains a method to query user profile info.
 * demonstrates the access to a protected api endpoint.
 */
export const profileService = {
  getProfile,
};

function getProfile() {
  return fetchWrapper.get(`${baseUrl}/profile`)
    .then((user) => {
        return user;
    });
}
