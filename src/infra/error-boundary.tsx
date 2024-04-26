/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ErrorInfo, PropsWithChildren } from "react";
import { message } from "@components";
import { AnyError } from "./error/types";
import { ErrorHandler } from "./error/handler";
import { debug } from "./debug";

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
    this.state = initialState;
    this.handler = new ErrorHandler();

    this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
    this.catchError = this.catchError.bind(this);
    this.catchRejectEvent = this.catchRejectEvent.bind(this);

  }

  /**
   * 返回值会更新到组件的 state 中
   */
  static getDerivedStateFromError(error: Error) {
    debug.infra("getDerivedStateFromError");
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
    this.handler.handleRenderError(error, info);
    debug.infra("TODO 解析错误类型");
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
   */
  private catchError(error: ErrorEvent): void {
    const parsed = this.handler.handleUncaughtError(error);
    if (parsed.type === "ignore") {
      return;
    }

    return this.alert(parsed.formatted ?? parsed.message);
  }

  /**
   * 捕获「promise & async/await 异常」
   */
  private catchRejectEvent(error: PromiseRejectionEvent): void {
    debug.infra("catchRejectEvent");
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

    this.setState({ error: parsed });
  }

  alert(msg: string | string[]) {
    message.error(msg);
  }

  confirm(msg: string | string[]) {
    debug.infra("confrim", msg);
  }

  render() {
    if (this.state.block) {
      return (<div>Ops!</div>);
    }

    return this.props.children;
  }
}
