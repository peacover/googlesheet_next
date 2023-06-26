import { google, sheets_v4 } from "googleapis";
import { END, PAGE_NAME, START } from "./inputs";

// const getServerSideProps = async () => {
//   const auth = await google.auth.getClient({
//     scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
//   });

//   const sheets = google.sheets({ version: "v4", auth });
//   const range = PAGE_NAME + "!" + START + ":" + END;

//   const response = await sheets.spreadsheets.values.get({
//     spreadsheetId: process.env.SHEET_ID,
//     range,
//   });
//   return response.data.values;
// };

// export const parseData = async () => {
//   const sheet_data = await getServerSideProps();
//   if (!sheet_data) {
//     return null;
//   }
//   const data = await sheet_data.map(([name, university]) => ({
//     name: name,
//     university: university,
//   }));
//   return data;
// };

// const getSheetIdFromURL = (url: string) => {
//   const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
//   const match = url.match(regex);
//   if (match && match.length > 1) {
//     return match[1];
//   }
//   throw new Error("Invalid Google Sheet URL");
// };

export const getSheetNames = async (URL : string) => {
  // getServerSideProps();
  // const auth = await google.auth.getClient({
  //   scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  // });
  // const sheets = google.sheets({ version: "v4", auth });

  // const sheetId = getSheetIdFromURL(URL);
  // // setSheetId(sheetId);
  // const spreadsheetMetadata = await sheets.spreadsheets.get({
  //   spreadsheetId: sheetId,
  // });

  // const sheetNames = spreadsheetMetadata.data.sheets?.map(
  //   (sheet: sheets_v4.Schema$Sheet) => sheet.properties?.title || ""
  // );
  // setSheetNames(sheetNames || []);
  // setSheets(sheets);
  // return sheetNames;
}