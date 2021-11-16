import { useEffect, useState } from "react";
import { profileService } from "../lib/services/profile.service";

/**
 * profile page component.
 * this is a protected page and cannot be accessed without user authentication as it's marked as "auth=true" at the bottom.
 * this value is respected in the _app.js file.
 */
export default function Profile() {
  
  const [profileInfo, setProfileInfo] = useState(null);

  useEffect(() => {
    profileService
      .getProfile()
      .then((profileInfo) => {
        setProfileInfo(profileInfo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return profileInfo ? (
    <div className="mt-10 max-w-lg text-center mx-auto">
      <p>This is protected profile page for {profileInfo.username}.</p>
      <p className="mt-5">
        This page cannot be accessed without authentication.
      </p>
    </div>
  ) : null;
}

Profile.auth = true;
