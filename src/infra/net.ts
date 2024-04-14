/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { Axios, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { v4 as uuidv4 } from 'uuid';
import localStorage from '@services/localStorage';
import { API, ApiRes } from "./net.types";

class Net {
  svc: Axios;

  constructor() {
    this.svc = axios.create({
      baseURL: 'http://101.42.42.11:8081/',
      timeout: 1000,
    });

    this.svc.interceptors.request.use(this.requestInterceptor);
    this.svc.interceptors.response.use(this.responseInterceptor);
  }

  async post<URL extends keyof API, D = any, T = API[URL]>(url: URL, body?: D, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.request<ApiRes<T>>({  method: "POST", url, data: body, ...config });
    return data.data;
  } 

  private async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await this.svc.request<T>(config);
  }

  private async requestInterceptor(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    config.headers = config.headers || {};
    config.headers['X-Request-ID'] = uuidv4();
    config.headers.token =  `bearer ${localStorage.getItem('authToken')}`;
    return config;
  }

  private responseInterceptor(response: AxiosResponse<ApiRes>): AxiosResponse {
    // TODO common error handler
    if (response.data === null) {
    }
    const { data } = response;
    return response;
  }

}

export const net = new Net();
