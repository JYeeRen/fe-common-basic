import { authProvider } from "@services/auth.service";
import { redirect } from "react-router-dom";

export async function loginLoader() {
  if (authProvider.isAuthenticated) {
    return redirect("/");
  }
  return null;
}
