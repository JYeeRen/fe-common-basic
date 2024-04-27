import axios, {
  Axios,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { v4 as uuidv4 } from "uuid";
import localStorage from "@services/localStorage";
import { URLs, Sources, ApiSuccess, ApiRes } from "@types";
import { ServerError } from "./error";

type OptionalParams<URL extends URLs, D = Sources[URL]['params']> = D extends undefined ? [D?, AxiosRequestConfig?] : [D, AxiosRequestConfig?];

class Net {
  private readonly svc: Axios;

  constructor() {
    this.svc = axios.create({
      baseURL: "http://101.42.42.11:8081/",
      timeout: 1000,
    });

    this.svc.interceptors.request.use(this.requestInterceptor);
    this.svc.interceptors.response.use(this.responseInterceptor);
  }

  async post<URL extends URLs, R = Sources[URL]['res']>(
    url: URL,
    ...[body, config]: OptionalParams<URL>
  ): Promise<R> {
    if (typeof url !== 'string') {
      throw new Error('miss url');
    }
    const { data } = await this.request<ApiSuccess<R>>({
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
      console.log(response.data.code);
      throw new ServerError(response.data);
    }
    if (response.data === null) {
      throw new ServerError(response.data);
    }
    return response;
  }
}

export const net = new Net();
