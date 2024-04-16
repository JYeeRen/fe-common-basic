import axios, {
  Axios,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { v4 as uuidv4 } from "uuid";
import localStorage from "@services/localStorage";
import { API, ApiRes, ApiSuccess } from "./net.types";

export class ServerError extends Error {
  message: string;
  code: number;

  constructor(res: { msg?: string; code: number }) {
    super(res.msg ?? "Server Error");
    this.message = res.msg ?? "Server Error";
    this.code = res.code;
  }
}

class Net {
  svc: Axios;

  constructor() {
    this.svc = axios.create({
      baseURL: "http://101.42.42.11:8081/",
      timeout: 1000,
    });

    this.svc.interceptors.request.use(this.requestInterceptor);
    this.svc.interceptors.response.use(this.responseInterceptor);
  }

  async post<URL extends keyof API, D = unknown, T = API[URL]>(
    url: URL,
    body?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const { data } = await this.request<ApiSuccess<T>>({
      method: "POST",
      url,
      data: body,
      ...config,
    });
    return data.data;
  }

  private async request<T>(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return await this.svc.request<T>(config);
  }

  private async requestInterceptor(
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> {
    config.headers = config.headers || {};
    config.headers["X-Request-ID"] = uuidv4();
    config.headers.Authorization = `Bearer ${localStorage.getItem("authToken")}`;
    return config;
  }

  private responseInterceptor(response: AxiosResponse<ApiRes>): AxiosResponse {
    if (response.data.code !== 0) {
      throw new ServerError(response.data);
    }
    if (response.data === null) {
      throw new ServerError(response.data);
    }
    return response;
  }
}

export const net = new Net();
