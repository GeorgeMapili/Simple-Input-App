import { ApiProvider } from "./providers/ApiProvider";
import { InputForm } from "./components/InputForm";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toast } from "./components/Toast";
import "./App.css";

/**
 * Main App component
 * Sets up providers, error boundaries, and main layout
 */
export default function App() {
  return (
    <ErrorBoundary>
      <ApiProvider>
        <Toast />
        <InputForm />
      </ApiProvider>
    </ErrorBoundary>
  );
}
