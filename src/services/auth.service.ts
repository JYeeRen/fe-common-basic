import { net } from "@infra";
import localStorage from "./localStorage";
import { redirect } from "react-router-dom";

export async function signin(credential: { account: string; password: string }) {
  const res = await authProvider.signin(credential);
  localStorage.setItem('authToken', res.token);
  localStorage.setItem('user', { name: 'admin' });
}

export async function signout() {
  await net.post('/api/account/logout');
  localStorage.setItem('authToken', undefined);
  localStorage.setItem('user', undefined);
}

interface AuthProvider {
  isAuthenticated: boolean;
  username: null | string;
  expireIn: number;
  init(): void;
  signin(credential: { account: string; password: string }): Promise<{ token: string; username: string; expireIn: number }>;
  signout(): Promise<void>;
}

/**
 * This represents some generic auth provider API, like Firebase.
 */
export const authProvider: AuthProvider = {
  isAuthenticated: false,
  username: null,
  expireIn: 0,

  init() {
    authProvider.isAuthenticated = Boolean(localStorage.getItem('authToken'));
    authProvider.username = localStorage.getItem('user')?.name ?? '';
    console.log(localStorage.getItem('authToken'), authProvider);
  },

  async signin(credential) {
    const { token, username, expireIn } = await net.post('/api/account/login', credential);
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', { name: username });
    authProvider.isAuthenticated = true;
    authProvider.username = username;
    authProvider.expireIn = expireIn;

    return { token, username, expireIn };
  },
  async signout() {
    await net.post('/api/account/logout');
    localStorage.setItem('authToken', '');
    localStorage.setItem('user', { name: '' });
    authProvider.isAuthenticated = false;
    authProvider.username = "";
    authProvider.expireIn = 0;
    redirect('/');
  },
};
