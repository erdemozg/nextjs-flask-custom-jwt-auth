import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { UserIcon, LockIcon, LoadingIcon } from "../components/icons";
import Alert from "../components/alert";
import { authService } from "../lib/services/auth.service";

/**
 * login page component.
 */
export default function Login() {
  
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const checkForm = () => {
    if (username.length == 0) {
      return {
        ok: false,
        message: "Missing info!",
      };
    }
    if (password.length == 0) {
      return {
        ok: false,
        message: "Missing info!",
      };
    }
    return {
      ok: true,
      message: "",
    };
  };

  const login = () => {
    setFormErrorMessage("");
    setLoading(true);

    const { ok, message } = checkForm();

    if (ok) {
      authService
        .login(username, password)
        .then((user) => {
          router.push("/profile");
          setLoading(false);
        })
        .catch((error) => {
          if (error == "check_credentials") {
            setFormErrorMessage("Please check your credentials!");
          } else {
            setFormErrorMessage(error.toString());
          }

          setLoading(false);
        });
    } else {
      setFormErrorMessage(message);
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 flex items-center justify-center">
      <div className="p-8 bg-white rounded-2xl w-full max-w-md shadow-lg space-y-2">
        <div>
          <label
            className="text-sm text-gray-500 tracking-wider"
            htmlFor="username"
          >
            Username
          </label>
          <div className="mt-1 relative">
            <div className="absolute top-2 left-2 text-gray-300 ">
              <UserIcon className="h-8 w-8" />
            </div>
            <input
              className="py-2 pl-10 border-2 border-indigo-500 outline-none rounded-md w-full shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-700"
              type="text"
              name="username"
              id="username"
              autoComplete="username"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label
            className="text-sm text-gray-500 tracking-wider"
            htmlFor="password"
          >
            Password
          </label>
          <div className="mt-1 relative">
            <div className="absolute top-2 left-2 text-gray-300 ">
              <LockIcon className="h-8 w-8" />
            </div>
            <input
              className="py-2 pl-10 border-2 border-indigo-500 outline-none rounded-md w-full shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-700"
              type="password"
              name="password"
              autoComplete="password"
              id="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full">
          <button
            onClick={login}
            className="mt-4 py-3 bg-indigo-500 text-white text-lg font-semibold rounded-md w-full outline-none shadow-md focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300"
          >
            {isLoading ? (
              <LoadingIcon className="animate-spin h-7 w-7 m-auto text-white" />
            ) : (
              "Login"
            )}
          </button>
        </div>
        {formErrorMessage && <Alert message={formErrorMessage} type="error" />}
        <div>
          <div className="my-5 w-full h-px bg-gray-300"></div>
        </div>
        <div className="w-full">
          <Link href="/signup" passHref={true}>
            <button className="py-3 bg-gray-300 text-gray-600 text-lg font-semibold rounded-md w-full outline-none shadow-md focus:ring-2 focus:ring-offset-1 focus:ring-gray-300">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
