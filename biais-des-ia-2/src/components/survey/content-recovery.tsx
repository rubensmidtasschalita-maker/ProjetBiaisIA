import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode; className?: string };
type State = { error: Error | null; recovered: boolean };

// Inline editors and browser extensions can replace DOM nodes React owns.
// Recover the content subtree once, without patching native DOM methods or
// suppressing unrelated rendering errors.
export class ContentRecovery extends Component<Props, State> {
  override state: State = { error: null, recovered: false };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  override componentDidCatch(error: Error, _info: ErrorInfo) {
    if (error.name === "NotFoundError" && !this.state.recovered) {
      this.setState({ error: null, recovered: true });
    }
  }

  override render() {
    if (this.state.error) {
      if (this.state.error.name !== "NotFoundError" || this.state.recovered) {
        throw this.state.error;
      }
      return null;
    }

    // A real host element lets React discard the entire affected subtree,
    // even when one of its descendants was removed outside React.
    return <div className={this.props.className ?? "min-h-0 flex-1 overflow-y-auto"}>{this.props.children}</div>;
  }
}