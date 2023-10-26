"use client";

import { FormURL } from "@/components/FormURL";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
export default async function Home() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <FormURL />
      </QueryClientProvider>
    </>
  );
}
