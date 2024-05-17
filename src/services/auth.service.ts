import { net } from "@infra";
import localStorage from "./localStorage";
import { debug } from "@infra";
import appService from "./app.service";
import { User } from "./types";

export async function signin(credential: {
  account: string;
  password: string;
}) {
  const res = await authProvider.signin(credential);
  localStorage.setItem("authToken", res.token);
  localStorage.setItem("user", res);
}

export async function signout() {
  await net.post("/api/account/logout");
  localStorage.setItem("authToken", undefined);
  localStorage.setItem("user", undefined);
}

interface AuthProvider {
  isAuthenticated: boolean;
  username: null | string;
  expireIn: number;
  expired(): void;
  init(): void;
  signin(credential: {
    account: string;
    password: string;
  }): Promise<User>;
  signout(): Promise<void>;
}

/**
 * This represents some generic auth provider API, like Firebase.
 */
export const authProvider: AuthProvider = {
  isAuthenticated: false,
  username: null,
  expireIn: 0,

  expired() {
    debug.auth("login expired");
    authProvider.isAuthenticated = false;
    localStorage.setItem("authToken", "");
    authProvider.expireIn = 0;
    const from = encodeURIComponent(
      window.location.hash.replace(/^#(.+)$/, "$1")
    );
    appService.navigate?.(`/login?from=${from}`);
  },

  init() {
    authProvider.isAuthenticated = Boolean(localStorage.getItem("authToken"));
    authProvider.username = localStorage.getItem("user")?.username ?? "";
  },

  async signin(credential) {
    const userInfo = await net.post("/api/account/login", credential);
    const { token, username, expireIn } = userInfo;
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", userInfo);
    authProvider.isAuthenticated = true;
    authProvider.username = username;
    authProvider.expireIn = expireIn;

    return userInfo;
  },
  async signout() {
    await net.post("/api/account/logout");
    localStorage.setItem("authToken", "");
    localStorage.setItem("user", {
      userId: 0,
      username: "",
      permissions: [],
      isManager: false,
      expireIn: 0,
      type: "",
      token: ''
    });
    authProvider.isAuthenticated = false;
    authProvider.username = "";
    authProvider.expireIn = 0;
  },
};
