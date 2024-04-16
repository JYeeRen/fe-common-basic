import { net } from "@/infra";
import localStorage from "./localStorage";
interface Credenial {
  account: string;
  password: string;
}

export async function signIn(credential: Credenial) {
  const res = await net.post('/api/account/login', credential);
  localStorage.setItem('authToken', res.token);
  localStorage.setItem('user', { name: 'admin' });
}