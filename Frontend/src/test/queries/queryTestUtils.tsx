import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export const TestQueryProvider = ({ children, client }: { children: ReactNode, client?: QueryClient }) => (
  <QueryClientProvider client={client || createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);
