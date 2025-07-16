import { User } from "oidc-client-ts";

export function getUserFromStorage(): User | null {
  const oidcStorage = localStorage.getItem(
    `oidc.user:https://terrakube-dex.platform.local/dex:terrakube-app`
  );
  console.log("OIDC storage item:", oidcStorage);
  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
}

export default getUserFromStorage;