import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authService } from "../lib/services/auth.service";
import { useAppSelector } from "../lib/client_state/hooks";
import { selectUser } from "../lib/client_state/user";
import Layout from "./layout";

/**
 * wraps the page component in _app.js file.
 * on first load, it calls the refresh token function to obtain a new access token and store it as an in-memory variable in global state.
 * it also checks if the page requires authentication and prevents protected pages from rendering for unauthenticated users.
*/
export default function AppWrapper({ children, authenticate }) {
  const user = useAppSelector(selectUser);
  const [refreshTokenCheckFinished, setRefreshTokenCheckFinished] = useState(false);
  const router = useRouter();

  useEffect(() => {
    authService
      .refreshToken()
      .then((user) => {
        setRefreshTokenCheckFinished(true);
      })
      .catch((error) => {
        console.log(error);
        setRefreshTokenCheckFinished(true);
      });
  }, []);

  useEffect(() => {
    if (refreshTokenCheckFinished && authenticate && !user.id) {
      router.push("/login");
    }
  }, [refreshTokenCheckFinished]);

  return refreshTokenCheckFinished && (!authenticate || !!user.id) ? (
    <Layout>{children}</Layout>
  ) : null;
}
