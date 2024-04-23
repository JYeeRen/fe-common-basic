import { t } from "@locale";
import { ParseError, ParseResult } from "./types";
import { ErrorParser } from "./parser";
import { debug } from '../debug';

/**
 * 全局异常处理
 * 显示错误信息，异常上报有 sentry 自动处理
 */
export class ErrorHandler {
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
    debug.common("handle render error", error, info);

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
    debug.common("handle uncaught error", error);
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
    debug.common("handle reject error", error);
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
