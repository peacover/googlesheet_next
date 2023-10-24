"use client";

import { FormURL } from "@/components/FormURL";
import { QueryClient, QueryClientProvider } from "react-query";
import { IGroup } from "./(data)/interfaces";
import { balanced_groups } from "./(data)/script";

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
