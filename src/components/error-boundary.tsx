"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 p-8 text-center">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Something went wrong
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
            {this.state.error.message || "Unexpected UI error"}
          </p>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm dark:bg-zinc-100 dark:text-zinc-900"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
