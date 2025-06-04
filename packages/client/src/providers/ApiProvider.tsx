import { useState } from "react";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClientOptions } from "../utils/api";

interface ApiProviderProps {
  children: ReactNode;
}

/**
 * Provider component for the tRPC API
 * Sets up React Query and tRPC client
 */
export function ApiProvider({ children }: ApiProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 60 * 1000, // 1 minute
          },
        },
      })
  );
  const [trpcClient] = useState(() =>
    trpc.createClient(trpcClientOptions as any)
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
