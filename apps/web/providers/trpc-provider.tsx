'use client';
import { QueryClientProvider } from "@tanstack/react-query";
import { trpc, queryClient, trpcClient } from "../trpc/client";

export default function TRPCProvider({ children }: { children: React.ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}