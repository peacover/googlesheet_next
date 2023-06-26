"use client";

import { FormURL } from "@/components/FormURL";
import { QueryClient, QueryClientProvider } from 'react-query';
import { IGroup } from "./(data)/interfaces";
import { balanced_groups } from "./(data)/script";


const queryClient = new QueryClient();
export default async function Home() {
  // const data : IGroup[][]| IGroup [] | null = await balanced_groups();

  // if (!data) {
  //   return <p>NO DATA IN THE SHEET!!</p>;
  // }
  

  return (
    <>
    <QueryClientProvider client={queryClient}>
      {/* {data.map((group, index) => (
        <div key={index}>
          <h1>Group {index + 1}</h1>
          <ul>
            {Array.isArray(group) &&
              group.map((swimmer, index) => (
                <li key={index}>
                  {swimmer.name} | {swimmer.university}
                </li>
              ))}
          </ul>
          <br/>
        </div>
      ))} */}
      <FormURL />
      </QueryClientProvider>
    </>
  );
}
