import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "./context/AuthContext.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import "./index.css";
import App from "./App.jsx";

// Create a QueryClient — manages all caching + fetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Show stale data while refetching in background
      refetchOnWindowFocus: false,
      // Retry failed requests once before showing error
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      {/* Wrap the whole app so any component can use useQuery */}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
