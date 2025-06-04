import { Toaster } from "react-hot-toast";

/**
 * Toast provider component that displays notifications
 */
export function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Default options for all toasts
        duration: 3000,
        style: {
          background: "#fff",
          color: "#333",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "4px",
          padding: "16px",
        },
        // Style for success toasts
        success: {
          style: {
            background: "#10b981",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#10b981",
          },
        },
        // Style for error toasts
        error: {
          style: {
            background: "#ef4444",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#ef4444",
          },
        },
      }}
    />
  );
}
