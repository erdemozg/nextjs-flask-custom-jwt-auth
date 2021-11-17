import { useState } from "react";
import Link from "next/link";
import { UserIcon, LockIcon, LoadingIcon } from "../components/icons";
import Alert from "../components/alert";
import { authService } from "../lib/services/auth.service";

/**
 * sign-up page component.
 */
export default function SignUp() {

  const [isLoading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [formMessage, setFormMessage] = useState({ message: "", type: "" });

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
    if (passwordConfirm.length == 0) {
      return {
        ok: false,
        message: "Missing info!",
      };
    }
    if (password != passwordConfirm) {
      return {
        ok: false,
        message: "Passwords do not match!",
      };
    }
    return {
      ok: true,
      message: "",
    };
  };

  const signUp = () => {
    setFormMessage({ message: "", type: "" });
    setLoading(true);
    const { ok, message } = checkForm();
    if (ok) {
      authService
        .signUp(username, password)
        .then((res) => {
          if (res.ok) {
            setFormMessage({ message: "User created", type: "success" });
          } else {
            console.log(res);
            setFormMessage({ message: "Something went wrong!", type: "error" });
          }
          setLoading(false);
        })
        .catch((error) => {
          if (error == "user_already_exists") {
            setFormMessage({ message: "User exists!", type: "error" });
          } else {
            console.log(error);
            setFormMessage({ message: error.toString(), type: "error" });
          }
          setLoading(false);
        });
    } else {
      setFormMessage({ message, type: "error" });
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
        <div>
          <label
            className="text-sm text-gray-500 tracking-wider"
            htmlFor="password"
          >
            Confirm Password
          </label>
          <div className="mt-1 relative">
            <div className="absolute top-2 left-2 text-gray-300 ">
              <LockIcon className="h-8 w-8" />
            </div>
            <input
              className="py-2 pl-10 border-2 border-indigo-500 outline-none rounded-md w-full shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-700"
              type="password"
              name="confirm_password"
              autoComplete="password"
              id="confirm_password"
              placeholder="Confirm Password"
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full">
          <button
            onClick={signUp}
            className="mt-4 py-3 bg-indigo-500 text-white text-lg font-semibold rounded-md w-full outline-none shadow-md focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300"
          >
            {isLoading ? (
              <LoadingIcon className="animate-spin h-7 w-7 m-auto text-white" />
            ) : (
              "Sign Up"
            )}
          </button>
        </div>
        {formMessage && formMessage.message && (
          <Alert message={formMessage.message} type={formMessage.type} />
        )}
        <div>
          <div className="my-5 w-full h-px bg-gray-300"></div>
        </div>
        <div className="w-full text-center">
          <Link href="/login">
            <a className="text-indigo-500 text-md font-light w-full focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300">
              Already have an account? Click to login
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
