import { Component, PropsWithChildren } from "react";

export class ErrorBoundary extends Component<PropsWithChildren, { hasError: boolean }> {

  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false };

  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // 示例“组件堆栈”：
    //   在 ComponentThatThrows 中（由 App 创建）
    //   在 ErrorBoundary 中（由 APP 创建）
    //   在 div 中（由 APP 创建）
    //   在 App 中
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      console.error('boundary')
      // 你可以渲染任何自定义后备 UI
      // return this.props.fallback;
    }

    return this.props.children;
  }

}