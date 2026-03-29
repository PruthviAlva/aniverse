// ErrorBoundary.jsx — Catches rendering errors gracefully
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen bg-anime-bg flex flex-col
                        items-center justify-center gap-4 px-4"
        >
          <h2 className="text-2xl font-bold text-anime-text">
            Something went wrong
          </h2>
          <p className="text-anime-muted text-sm text-center max-w-md">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-anime-primary hover:bg-orange-600 text-white
                       font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
