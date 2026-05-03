import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  // Đảm bảo QueryClient chỉ được tạo một lần cho mỗi session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 phút data không bị xem là stale
            refetchOnWindowFocus: false, // Không tự động fetch khi focus lại tab
            retry: 1, // Tự động thử lại 1 lần nếu lỗi
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  );
}
