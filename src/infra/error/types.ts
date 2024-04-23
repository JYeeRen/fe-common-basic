export type ErrCode =
  | HttpErrCode
  | UploadErrCode
  | PutNetErrCode
  | DeleteNetErrCode;

export enum UploadErrCode {
  UPLOAD_ERROR = "U0001",
}

export enum PutNetErrCode {
  PUT_NET_ERROR = "P0001",
}

export enum DeleteNetErrCode {
  DELETE_NET_ERROR = "D0001",
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
