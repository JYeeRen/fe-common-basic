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

type OptionalParams<
  URL extends URLs,
  D = Sources[URL]["params"]
> = D extends undefined ? [D?, AxiosRequestConfig?] : [D, AxiosRequestConfig?];

class Net {
  private readonly svc: Axios;

  constructor() {
    this.svc = axios.create({
      baseURL: "http://101.42.42.11:8081/",
      // timeout: 1000,
    });

    this.svc.interceptors.request.use(this.requestInterceptor);
    this.svc.interceptors.response.use(this.responseRedirectInterceptor);
    this.svc.interceptors.response.use(this.responseInterceptor);
  }

  async get<URL extends URLs, R = Sources[URL]["res"]>(
    url: URL,
    ...[body, config]: OptionalParams<URL>
  ): Promise<R> {
    if (typeof url !== "string") {
      throw new Error("miss url");
    }
    const { data } = await this.request<ApiSuccess<R>>({
      method: "GET",
      url,
      params: body,
      ...config,
    });
    return data.data;
  }

  async post<URL extends URLs, R = Sources[URL]["res"]>(
    url: URL,
    ...[body, config]: OptionalParams<URL>
  ): Promise<R> {
    if (typeof url !== "string") {
      throw new Error("miss url");
    }
    const { data } = await this.request<ApiSuccess<R>>({
      method: "POST",
      url,
      data: body,
      ...config,
    });
    return data.data;
  }

  async upload<URL extends URLs, R = Sources[URL]["res"]>(
    url: URL,
    ...[body, config]: OptionalParams<URL>
  ): Promise<R> {
    if (typeof url !== "string") {
      throw new Error("miss url");
    }
    const { data } = await this.request<ApiSuccess<R>>({
      method: "POST",
      url,
      data: body,
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data.data;
  }

  async download<URL extends URLs, R = Sources[URL]["res"]>(
    url: URL,
    ...[body, config]: OptionalParams<URL>
  ): Promise<void> {
    if (typeof url !== "string") {
      throw new Error("miss url");
    }
    const { data } = await this.request<ApiSuccess<R>>({
      method: "POST",
      url,
      data: body,
      ...config,
    });
    const { fileName, url: downloadUrl } = data.data as {
      fileName: string;
      url: string;
    };

    if (!fileName) throw new Error('导出失败');
    if (!downloadUrl) throw new Error('导出失败');

    const res = await axios.get(downloadUrl, {
      responseType: "blob",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    const blob = res.data;
    if (!(blob instanceof Blob)) throw new Error("blob");

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
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
    config.headers.Authorization = `Bearer ${localStorage.getItem(
      "authToken"
    )}`;
    return config;
  }

  async responseRedirectInterceptor(
    response: AxiosResponse<ApiRes>
  ): Promise<AxiosResponse> {
    if (response.status === 301 || response.status === 302) {
      // 重定向的 URL 在 'location' 头部中
      const redirectUrl = response.headers.location;
      if (redirectUrl) {
        // 执行重定向请求
        return await axios.get(redirectUrl);
      }
    }
    // const res = await axios.get(url, { responseType: 'blob', headers: {
    //   'Access-Control-Allow-Origin': '*',
    // } });

    // const blob = res.data;
    // console.log(typeof blob)
    // if (!(blob instanceof Blob)) throw new Error('blob');

    // const link = document.createElement('a');
    // link.href = window.URL.createObjectURL(blob);
    // link.download = 'customs_item_export_1715332628.xlsx';
    // link.click();
    // window.URL.revokeObjectURL(link.href);
    return response;
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
