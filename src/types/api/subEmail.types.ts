import { ListRes } from "./common.types";

export interface SubEmailAPI {
  "/api/subscriptionEmail/add": {
    params: { email: string };
    res?: never;
  }
  "/api/subscriptionEmail/delete": {
    params: { ids: number[] };
    res?: never;
  }
  "/api/subscriptionEmail/findList": {
    params: { page: number; size: number };
    res: ListRes<{
      id: number;
      email: string;
    }>;
  }
}