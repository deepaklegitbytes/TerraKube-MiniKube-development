import { User } from "oidc-client-ts";

export function getUserFromStorage(): User | null {
  const oidcStorage = localStorage.getItem(
    `oidc.user:${window._env_.REACT_APP_AUTHORITY}:${window._env_.REACT_APP_CLIENT_ID}`
  );
  console.log("OIDC storage item:", oidcStorage);
  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
}

export default getUserFromStorage;