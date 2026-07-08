import { getSession, signOut } from "next-auth/react";

export async function getAuthHeaders(session) {
  const freshSession = await getSession();
  const jwt = freshSession?.jwt || session?.jwt;
  if (!jwt) return null;
  return { Authorization: `Bearer ${jwt}` };
}

export async function handleAuthError(response) {
  if (response.status === 401) {
    alert("Your session expired. Please sign in again.");
    await signOut({ callbackUrl: "/signin" });
    return true;
  }
  return false;
}
