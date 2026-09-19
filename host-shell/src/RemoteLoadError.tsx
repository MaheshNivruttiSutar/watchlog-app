import { Component, type ErrorInfo, type ReactNode } from 'react';

interface RemoteLoadErrorProps {
  children: ReactNode;
}

interface RemoteLoadErrorState {
  message: string | null;
}

export class RemoteLoadError extends Component<
  RemoteLoadErrorProps,
  RemoteLoadErrorState
> {
  state: RemoteLoadErrorState = { message: null };

  static getDerivedStateFromError(error: Error): RemoteLoadErrorState {
    return { message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('WatchLog remote failed to load', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.message) {
      return (
        <p role="alert">
          Could not load WatchLog. Start the remote on port 3001, then refresh.
          ({this.state.message})
        </p>
      );
    }

    return this.props.children;
  }
}
