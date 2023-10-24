"use client";

import { useState } from "react";
import { SheetNamesComponent } from "./SheetNamesComponent";
import { getSheetIdFromURL } from "@/lib/utils";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const FormURL = () => {
  const [URL, setURL] = useState<string>("");
  const [SheetId, setSheetId] = useState<string>("");
  const [sheetNames, setSheetNames] = useState<string[]>(["Enter a URL"]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  const handleFormURL = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploaded(true);
    const sheetId: string = getSheetIdFromURL(URL);
    const response = await axios.post("/api/sheetNames", { sheetId });
    if (!response.data) return;
    setSheetId(sheetId);
    setSheetNames(response.data);
    setIsUploaded(false);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-[100px]">
        <form onSubmit={handleFormURL}>
          <div className="flex flex-row items-center justify-center space-x-7 p-8 border border-black rounded-md">
            <label
              htmlFor="url"
              className="mb-2 text-md font-medium text-gray-900"
            >
              Google Sheet URL:{" "}
            </label>
            <Input
              className="w-[500px]"
              id="url"
              type="text"
              value={URL}
              onChange={(event) => {
                setURL(event.target.value);
                event.target.value.length > 0
                  ? setIsLoading(true)
                  : setIsLoading(false);
              }}
              required
            />
            {!isLoading && <Loader2 className="mr-2 h-8 w-8 animate-spin" />}
            <Button type="submit">Upload</Button>
          </div>
          <div
            className={`fixed inset-0 flex items-center justify-center backdrop-blur-lg ${
               isUploaded ? "block" : "hidden"
            }`}
          >
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </form>
        <SheetNamesComponent
          key={SheetId}
          sheetId={SheetId}
          sheetNames={sheetNames}
        />
      </div>
    </>
  );
};
