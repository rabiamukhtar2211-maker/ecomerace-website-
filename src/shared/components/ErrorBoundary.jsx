import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Lumière Application Error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF3F9] flex items-center justify-center p-6 text-center">
          <div className="card-lux max-w-md w-full p-8 border border-[#E8D6EA] shadow-xl rounded-2xl bg-white/90 backdrop-blur-md">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#7B247F]/15 text-[#7B247F]">
              <AlertTriangle className="size-7 text-[#7B247F]" />
            </div>

            <h1 className="font-display text-2xl font-semibold text-[#35104F]">
              Atelier Notice
            </h1>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              We encountered a minor luxury display nuance. Please reload the page to restore your session seamlessly.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#7B247F] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-[#681E6B] transition-colors cursor-pointer"
              >
                <RefreshCw className="size-3.5" /> Reload Page
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-card px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <Home className="size-3.5" /> Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
