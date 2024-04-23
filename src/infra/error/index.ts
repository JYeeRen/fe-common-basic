export class ServerError extends Error {
  message: string;
  code: number;

  constructor(res: { msg?: string; code: number }) {
    super(res.msg ?? "Server Error");
    this.message = res.msg ?? "Server Error";
    this.code = res.code;
  }
}
