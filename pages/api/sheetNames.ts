import { google, sheets_v4 } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getSheetNames(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!req.body.sheetId) {
      throw new Error("Invalid Google Sheet URL");
    }
    const auth = await google.auth.getClient({
      //   keyFile: "/secrets.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    const sheetId = req.body.sheetId;
    const spreadsheetMetadata = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    const sheetNames = spreadsheetMetadata.data.sheets?.map(
      (sheet: sheets_v4.Schema$Sheet) => sheet.properties?.title || null
    ) as string[];
    res.status(200).json(sheetNames);
  } catch (err) {
    res.status(400).json(err);
  }
}
