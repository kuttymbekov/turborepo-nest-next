import { CreateTRPCReact, createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@repo/trpc/router";
import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";

// @ts-ignore
export const trpc : CreateTRPCReact<AppRouter, any> = createTRPCReact<AppRouter, any>();

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_TRPC_URL as string,
    }),
  ],
});