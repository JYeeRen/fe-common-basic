/* eslint-disable @typescript-eslint/no-explicit-any */
import { t } from "@locale";
import { HttpErrCode, ServerErrCode, ParseError, ParseResult } from "./types";
import { debug } from "../debug";
import { authProvider } from "@services/auth.service";

export class ErrorParser {
  /**
   * 清理历史异常的定时器
   */
  private timeout: NodeJS.Timeout | null = null;

  /**
   * 历史异常记录，用于抑制相同异常
   */
  private readonly history: Map<string, ParseError>;

  constructor() {
    this.history = new Map<string, ParseError>();
  }

  /**
   * 解析并处理异常
   * @param error
   * @returns 返回true时，跳转错误页面
   */
  parse(error: ParseError): ParseResult {
    debug.common("parse", error);

    // 抑制相同的异常
    if (this.isRestrict(error)) {
      return { ...error, type: "ignore" };
    }

    // 处理超时异常，跳转登录页面
    if (this.isLoginTimeout(error)) {
      debug.common("login timeout");
      return { ...error, type: "ignore" };
    }

    // CSRF TOKEN失效
    if (this.isTokenError(error)) {
      debug.common("bearer token");
      return { ...error, type: "ignore" };
    }

    // 请求超时 408
    if (this.parseRequestTimeout(error)) {
      debug.common("request timeout error");
      return { ...error, type: "alert", formatted: t("请求超时") };
    }

    // 处理后台接口存在校验规则的错误
    if (this.parseValidatorError(error)) {
      debug.common("request error");
      return { ...error, type: "alert", formatted: t(error.message as any) };
    }

    // 处理400系列错误
    if (this.parseRequestError(error)) {
      debug.common("request error");
      return { ...error, type: "alert" };
    }

    // 处理500系列错误
    if (this.parseResponseError(error)) {
      debug.common("response error");
      return { ...error, type: "alert" };
    }

    debug.common("unknown error");
    return { ...error, type: "alert" };
  }

  private parseValidatorError(error: ParseError): boolean {
    if (typeof error.code !== "number") {
      return false;
    }
    if (
      error.code === HttpErrCode.BAD_REQUEST &&
      error?.error.code === HttpErrCode.BAD_REQUEST
    ) {
      return true;
    }
    return false;
  }

  private parseRequestTimeout(error: ParseError): boolean {
    return error.code === 408;
  }

  private parseRequestError(error: ParseError): boolean {
    if (typeof error.code !== "number") {
      return false;
    }
    if (error.code >= 400 && error.code < 500) {
      return true;
    }
    return false;
  }

  private parseResponseError(error: ParseError): boolean {
    if (typeof error.code === "number" && error.code > 500) {
      return true;
    }
    return false;
  }

  private isLoginTimeout(error: ParseError): boolean {
    if (
      error.code !== ServerErrCode.C401 &&
      error.message !== "login timeout or not login"
    ) {
      return false;
    }
    setTimeout(() => authProvider.expired(), 500);
    return true;
  }

  private isTokenError(error: ParseError): boolean {
    console.log('>>>>>>>>>', error)
    if (
      error.code !== ServerErrCode.C99 &&
      error.message !== "token decode error" &&
      error.message !== "token encrypt error"
    ) {
      return false;
    }
    setTimeout(() => authProvider.expired(), 500);
    return true;
  }

  // /**
  //  * 表单输入异常
  //  * TODO: 应该换更明确的异常判断方法 reason.errorFields 有数据属于 antd 表单错误不需alert
  //  * @param error
  //  * @returns
  //  */
  // private isFormError({ error }: ParseError): boolean {
  //   if (error.errorFields == null) {
  //     return false;
  //   }
  //   return true;
  // }

  /**
   * 抑制相同的异常
   * @param error
   * @param timer
   * @returns
   */
  private isRestrict(error: ParseError, timer = 1000): boolean {
    const { timestamp, kind } = error;
    const key = `${Math.floor(timestamp / 100)}-${kind}`;

    if (this.history.has(key)) {
      debug.common("restrict", key);

      if (this.timeout != null) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => this.history.clear(), timer);
      return true;
    }

    this.history.set(key, error);
    return false;
  }
}
