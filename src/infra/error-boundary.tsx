/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ErrorInfo, PropsWithChildren } from "react";

import { AnyError, ErrCode, HttpErrCode } from "./error/types";

type ErrorBoundaryState =
  | {
      didCatch: true;
      error: any;
      block: boolean;
    }
  | {
      didCatch: false;
      block: false;
      error: null;
    };

const initialState: ErrorBoundaryState = {
  didCatch: false,
  block: false,
  error: null,
};

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  private readonly handler: ErrorHandler;

  constructor(props: PropsWithChildren) {
    super(props);
    this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
    this.state = initialState;

    this.handler = new ErrorHandler();
  }

  /**
   * If you define static getDerivedStateFromError, React will call it when a child component (including
   * distant children) throws an error during rendering. This lets you display an error message instead of
   * clearing the UI.
   * Typically, it is used together with componentDidCatch which lets you send the error report to some
   * analytics service. A component with these methods is called an error boundary.
   *
   * 返回值会更新到组件的 state 中
   */
  static getDerivedStateFromError(error: Error) {
    return { didCatch: true, error, block: true };
  }  

  resetErrorBoundary() {
    const { error } = this.state;
    if (error !== null) {
      this.setState(initialState);
    }
  }

  /**
   * 只能捕获 react 渲染异常
   */ 
  componentDidCatch(error: AnyError, info: ErrorInfo) {
    console.log("handle render error", error, info);
    console.log("TODO 解析错误类型");
  }

  componentDidMount(): void {
    window.addEventListener('error', this.catchError, true);
    window.addEventListener('unhandledrejection', this.catchRejectEvent, true);
  }

  componentWillUnmount(): void {
    window.removeEventListener('error', this.catchError, true);
    window.removeEventListener('unhandledrejection', this.catchRejectEvent, true);
  }

  /**
   * 捕获「同步方法 & 异步方法 & 资源加载 异常」
   *
   * Error页面过于隆重，这种异常只用alert方式提示
   */
  private catchError(error: ErrorEvent): void {
    error.stopPropagation();
    console.log("catchError");
    return;
    const parsed = this.handler.handleUncaughtError(error);
    if (parsed.type === "ignore") {
      return;
    }

    // reporter.captureException(error);
    return this.alert(parsed.formatted ?? parsed.message);
  }

  /**
   * 捕获「promise & async/await 异常」
   */
  private catchRejectEvent(error: PromiseRejectionEvent): void {
    console.log("catchRejectEvent");
    console.log("handle uncaught error", error.reason instanceof Error, error.reason.code, error.reason.message);
    error.stopPropagation();
    return;
    const parsed = this.handler.handleRejectError(error);
    if (parsed.type === "ignore") {
      return;
    }
    if (parsed.type === "alert") {
      return this.alert(parsed.formatted ?? parsed.message);
    }
    if (parsed.type === "confirm") {
      return this.confirm(parsed.formatted ?? parsed.message);
    }

    // reporter.captureException(error);
    this.setState({ error: parsed });
  }

  alert(msg: string | string[]) {
    console.log("alert", msg);
  }

  confirm(msg: string | string[]) {
    console.log("confirm", msg);
  }

  render() {
    if (this.state.block) {
      return (<div>Ops!</div>);
    }

    return this.props.children;
  }
}

/**
 * 错误边界，处理的错误类型包括：
 * 1. 渲染错误
 * 2. 同步方法 & 异步方法 & 资源加载 异常
 * 3. promise & async/await 异常
 */
// export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {

//   private readonly handler: ErrorHandler;

//   constructor(props: ErrorBoundaryProps) {
//     super(props);
//     this.state = { error: null };

//     this.handler = new ErrorHandler();
//     this.catchError = this.catchError.bind(this);
//     this.catchRejectEvent = this.catchRejectEvent.bind(this);
//   }

//   /**
//    * 在componentDidCatch里格式化后，再显示异常内容
//    *
//    * 用于在组件的子组件抛出错误后捕获并处理错误，
//    * 通常使用该方法来显示一个错误信息，以便用户知道发生了错误。
//    * getDerivedStateFromError会先被调用，用于更新组件的状态，然后，componentDidCatch会被调用
//    */
//   // static getDerivedStateFromError(): Pick<ErrorBoundaryState, 'hasError'> {
//   //   return { hasError: true };
//   // }

//   componentDidMount(): void {
//     window.addEventListener('error', this.catchError, true);
//     window.addEventListener('unhandledrejection', this.catchRejectEvent, true);
//   }

//   componentWillUnmount(): void {
//     window.removeEventListener('error', this.catchError, true);
//     window.removeEventListener('unhandledrejection', this.catchRejectEvent, true);
//   }

//   /**
//    * 捕获「渲染错误」
//    * 用于捕获并处理组件的子组件抛出的错误，通常在该方法中可以记录错误日志或发送错误报告等操作
//    *
//    * 这种异常通常不会出现，跳转到Error页面
//    */
//   componentDidCatch(error: Error, info: ErrorInfo): void {
//     const parsed = this.handler.handleRenderError(error, info);
//     if (parsed.type === 'ignore') {
//       return;
//     }

//     reporter.captureException(error);
//     this.setState({ error: parsed });
//   }

//   /**
//    * 捕获「同步方法 & 异步方法 & 资源加载 异常」
//    *
//    * Error页面过于隆重，这种异常只用alert方式提示
//    */
//   private catchError(error: ErrorEvent): void {
//     const parsed = this.handler.handleUncaughtError(error);
//     if (parsed.type === 'ignore') {
//       return;
//     }

//     reporter.captureException(error);
//     return this.alert(parsed.formatted ?? parsed.message);
//   }

//   /**
//    * 捕获「promise & async/await 异常」
//    */
//   private catchRejectEvent(error: PromiseRejectionEvent): void {
//     const parsed = this.handler.handleRejectError(error);
//     if (parsed.type === 'ignore') {
//       return;
//     }
//     if (parsed.type === 'alert') {
//       return this.alert(parsed.formatted ?? parsed.message);
//     }
//     if (parsed.type === 'confirm') {
//       return this.confirm(parsed.formatted ?? parsed.message);
//     }

//     reporter.captureException(error);
//     this.setState({ error: parsed });
//   }

//   private alert(error: string | string[]): void {
//     Base.message.error(error);
//   }

//   private confirm(content: string | string[]): void {
//     confirm({ title: t('错误'), content });
//   }

//   render(): ReactNode {
//     if (this.state.error != null) {
//       return <Exception error={this.state.error} />;
//     }

//     return this.props.children;
//   }

// }

/**
 * 全局异常处理
 * 显示错误信息，异常上报有 sentry 自动处理
 */
class ErrorHandler {
  /**
   * 异常解析器
   */
  private readonly parser: ErrorParser;

  constructor() {
    this.parser = new ErrorParser();
  }

  /**
   * 处理渲染错误
   * @param error
   * @param info
   */
  handleRenderError(error: Error, info: React.ErrorInfo): ParseResult {
    console.log("handle render error", error, info);

    const formatted: ParseError = {
      kind: "componentdidcatch",
      timestamp: Date.now(),
      message: error.message,
      error,
    };

    return this.parser.parse(formatted);
  }

  /**
   * 处理同步方法 & 异步方法 & 资源加载 异常
   * @param error
   */
  handleUncaughtError(error: ErrorEvent): ParseResult {
    console.log("handle uncaught error", error);
    error.stopPropagation();

    // 如img的src请求异常等
    if (error.error == null) {
      return {
        type: "ignore",
        kind: "onerror",
        timestamp: Date.now(),
        message: error.message,
        error,
      };
    }

    const formatted: ParseError = {
      kind: "onerror",
      timestamp: Date.now(),
      message: error.message,
      code: error.error.code,
      stack: error.error.stack,
      error: error.error,
    };

    return this.parser.parse(formatted);
  }

  /**
   * 处理promise & async/await 异常
   * @param error
   */
  handleRejectError(error: PromiseRejectionEvent): ParseResult {
    console.log("handle reject error", error);
    error.stopPropagation();

    const formatted: ParseError = {
      kind: "onunhandledrejection",
      timestamp: Date.now(),
      message: error.reason.message ?? t("未知异常，请于管理员联系"),
      code: error.reason.code,
      error: error.reason,
    };

    return this.parser.parse(formatted);
  }
}

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
    console.log("parse", error);

    // 抑制相同的异常
    if (this.isRestrict(error)) {
      return { ...error, type: "ignore" };
    }

    // 处理超时异常，跳转登录页面
    if (this.isLoginTimeout(error)) {
      console.log("login timeout");
      return { ...error, type: "ignore" };
    }

    // CSRF TOKEN失效
    if (this.isCsrfError(error)) {
      console.log("csrf token");
      return { ...error, type: "ignore" };
    }

    // 表单异常，忽略
    if (this.isFormError(error)) {
      console.log("form error");
      return { ...error, type: "ignore" };
    }

    // 处理删除响应不正确异常（如，删除的返回结果为0）
    if (this.isDeleteResponseError(error)) {
      console.log("delete response error");
      return { ...error, type: "alert", formatted: t("删除异常") };
    }

    // 处理多次请求POST请求异常
    if (this.isUpdateResponseError(error)) {
      console.log("update response error");
      return { ...error, type: "alert", formatted: t("更新异常") };
    }

    // 导入错误
    if (this.isImportError(error)) {
      console.log("import error");
      return { ...error, type: "confirm", formatted: error.message.split(",") };
    }

    // 请求超时 408
    if (this.parseRequestTimeout(error)) {
      console.log("request timeout error");
      return { ...error, type: "alert", formatted: t("请求超时") };
    }

    // 处理后台接口存在校验规则的错误
    if (this.parseValidatorError(error)) {
      console.log("request error");
      return { ...error, type: "alert", formatted: t(error.message as any) };
    }

    // 处理400系列错误，跳转错误页面
    if (this.parseRequestError(error)) {
      console.log("request error");
      return { ...error, type: "show" };
    }

    // 处理500系列错误，跳转错误页面
    if (this.parseResponseError(error)) {
      console.log("response error");
      return { ...error, type: "show" };
    }

    console.log("unknown error");
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

  private isImportError(error: ParseError): boolean {
    // return error.code === UploadErrCode.UPLOAD_ERROR;
    return false;
  }

  private isDeleteResponseError(error: ParseError): boolean {
    // return error.code === DeleteNetErrCode.DELETE_NET_ERROR;
    return false;
  }

  private isUpdateResponseError(error: ParseError): boolean {
    // return error.code === PutNetErrCode.PUT_NET_ERROR;
    return false;
  }

  private isLoginTimeout(error: ParseError): boolean {
    // if (error.code === ParamErrCode.COMMON) {
    //   return false;
    // }

    // if (error.message !== 'NOT LOGGED IN') {
    //   return false;
    // }

    // setTimeout(() => window.location.href = '/v2/login', 500);
    return false;
  }

  private isCsrfError(error: ParseError): boolean {
    if (error.message !== "EBADCSRFTOKEN") {
      return false;
    }

    setTimeout(() => (window.location.href = "/v2/login"), 500);
    return true;
  }

  /**
   * 表单输入异常
   * TODO: 应该换更明确的异常判断方法 reason.errorFields 有数据属于 antd 表单错误不需alert
   * @param error
   * @returns
   */
  private isFormError({ error }: ParseError): boolean {
    if (error.errorFields == null) {
      return false;
    }
    return true;
  }

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
      console.log("restrict", key);

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
export interface ParseError {
  kind: "onerror" | "onunhandledrejection" | "componentdidcatch";
  timestamp: number;
  message: string;
  stack?: string;
  code?: ErrCode;
  error: AnyError;
}
