import { google } from "googleapis";
import { END, PAGE_NAME, START } from "./inputs";

const getServerSideProps = async () => {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const range = PAGE_NAME + "!" + START + ":" + END;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });

  return response.data.values;
}

export const parseData = async () => {
  const sheet_data = await getServerSideProps();
  if (!sheet_data) {
    return null;
  }
  const data = await sheet_data.map(([name, university]) => ({
    name : name,
    university : university,
  }));
  return data;
}
