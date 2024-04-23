export type ErrCode =
  | HttpErrCode
  | ServerErrCode
  ;

export enum ServerErrCode {
  C401 = -401,
  C99 = -99,
}

export enum HttpErrCode {
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  ENHANCE_YOUR_CLAM = 420,
  INTERNAL_SERVER = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyError = any;

export interface ParseError {
  kind: "onerror" | "onunhandledrejection" | "componentdidcatch";
  timestamp: number;
  message: string;
  stack?: string;
  code?: ErrCode;
  error: AnyError;
}

export interface ParseResult extends ParseError {
  /**
   * 显示异常的方式
   * show: 显示异常页面
   * alert: toast显示异常信息
   * confirm: 显示确认框
   * ignore: 忽略异常
   */
  type: "show" | "alert" | "confirm" | "ignore";

  /**
   * 格式化后的信息
   */
  formatted?: string | string[];
}
