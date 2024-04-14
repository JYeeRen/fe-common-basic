import { net } from "@/infra";
import localStorage from "./localStorage";
interface Credenial {
  username: string;
  password: string;
}

export async function signIn(credential: Credenial) {
  const res = await net.post('/api/account/login', credential);
  localStorage.setItem('authToken', res.token);
}