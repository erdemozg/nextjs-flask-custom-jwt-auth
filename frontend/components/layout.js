import Link from "next/link";
import { authService } from "../lib/services/auth.service";
import { useAppSelector } from "../lib/client_state/hooks";
import { selectUser } from "../lib/client_state/user";

/**
 * common layout for pages (used in AppWrapper component).
 * navigation bar is rendered conditionally depending on user authentication status.
 */
export default function Layout({ children }) {

  const user = useAppSelector(selectUser);

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div className="font-roboto">
      <nav className="p-4 w-full flex justify-between bg-black text-white">
        <div className="flex justify-center items-center">
          <Link href="/">
            <a className="text-2xl font-bold tracking-wide" href="#">
              nextjs-custom-jwt-auth
            </a>
          </Link>
        </div>
        <div className="flex items-center justify-center space-x-4">
          {user && user.id ? (
            <>
              <a
                href="#"
                onClick={handleLogout}
                className="py-1 px-6 outline-none border-none bg-gray-600 rounded focus:ring focus:ring-white focus:ring-offset-1 hover:bg-white hover:text-black focus:outline-none"
              >
                Log out
              </a>

              <Link href="/profile">
                <a
                  href="#"
                  className="py-1 px-6 outline-none border-none bg-gray-600 rounded focus:ring focus:ring-white focus:ring-offset-1 hover:bg-white hover:text-black focus:outline-none"
                >
                  Profile ({user.username})
                </a>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <a
                href="#"
                className="py-1 px-6 outline-none border-none bg-gray-600 rounded focus:ring focus:ring-white focus:ring-offset-1 hover:bg-white hover:text-black focus:outline-none"
              >
                Login
              </a>
            </Link>
          )}
        </div>
      </nav>
      {children}
    </div>
  );
}
