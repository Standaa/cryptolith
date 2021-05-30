import React, { ErrorInfo, ReactNode } from "react";

interface ErrorState {
  hasError: boolean;
}

interface Props {
  children: ReactNode;
}

export class ErrorBoundary extends React.Component<Props, ErrorState> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true } as ErrorState;
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <h1>There has been an error</h1>;
    }
    return this.props.children;
  }
}
