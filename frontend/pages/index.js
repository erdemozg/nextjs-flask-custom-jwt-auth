import {
  useAppSelector
} from "../lib/client_state/hooks";

import {
  selectUser
} from '../lib/client_state/user';

/**
 * Home page component.
 * User is greeted conditionally depending on authentication status.
 */
export default function Home() {
  const user = useAppSelector(selectUser);

  return (
    <div className="mt-10 max-w-lg text-center mx-auto">
      Welcome {user && user.id ? user.username : "stranger"}!
    </div>
  );
}
