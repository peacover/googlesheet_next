"use client";

import { IGroup } from "@/app/(data)/interfaces";
import { getSheetNames } from "@/app/(data)/parseData";
import { balanced_groups } from "@/app/(data)/script";
import { google, sheets_v4 } from "googleapis";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
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
  //   const runScript = async (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();

  //     if (sheets) {
  //       const range = selectedSheetName + "!" + START + ":" + END;
  //       const response = await sheets.spreadsheets.values.get({
  //         spreadsheetId: SheetId,
  //         range,
  //       });
  //       const sheet_data = response.data.values || [];
  //       const parsed_data: IGroup[] = await sheet_data.map(
  //         ([name, university]) => ({
  //           name: name,
  //           university: university,
  //         })
  //       );
  //       const data: IGroup[][] | null = await balanced_groups(
  //         parsed_data,
  //         NUM_LANES,
  //         MIN_NUMBER_PER_GROUP
  //       );
  //       setData(data);
  //     }
  //   };

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
