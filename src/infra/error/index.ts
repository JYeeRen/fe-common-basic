export class ServerError extends Error {
  message: string;
  code: number;

  constructor(res: { msg?: string; code: number }, traceId?: string) {
    super(`${res.msg ?? "Server Error"} ${traceId ?? ''}`);
    this.message = `${res.msg ?? "Server Error"} ${traceId ?? ''}`;
    this.code = res.code;
  }
}
