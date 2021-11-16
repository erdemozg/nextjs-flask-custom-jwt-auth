import "../styles/globals.css";
import { Provider } from "react-redux";
import AppWrapper from "../components/app_wrapper";
import { store } from "../lib/client_state/store";

/**
 * main app component.
 * entire app is wrapped with redux state provider.
 * page components are wrapped with AppWrapper to prevent unauthenticated access to protected pages.
 * AppWrapper is also responsible for refreshing the access token on first load or browser level page refreshes.
 * (since the access token is stored as an in-memory variable in global state)
 */
function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AppWrapper authenticate={Component.auth || false}>
        <Component {...pageProps} />
      </AppWrapper>
    </Provider>
  );
}

export default MyApp;
