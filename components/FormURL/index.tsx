"use client";

import { useState } from "react";
import { SheetNamesComponent } from "./SheetNamesComponent";

export const FormURL = () => {
  const [URL, setURL] = useState<string>("");
  const [SheetId, setSheetId] = useState<string>("");

  const getSheetIdFromURL = (url: string) => {
    const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
    const match = url.match(regex);
    if (match && match.length > 1) {
      return match[1];
    }
    throw new Error("Invalid Google Sheet URL");
  };

  const handleFormURL = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sheetId: string = getSheetIdFromURL(URL);
    setSheetId(sheetId);
  };

  return (
    <>
      <form onSubmit={handleFormURL}>
        <label htmlFor="url">Google Sheet URL: </label>
        <input
          id="url"
          type="text"
          value={URL}
          onChange={(event) => setURL(event.target.value)}
          required
        />
        <input type="submit" value="Submit" />
      </form>
      {SheetId && <SheetNamesComponent sheetId={SheetId} />}
    </>
  );
};
