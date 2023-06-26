import { IGroup } from "@/app/(data)/interfaces";
import { balanced_groups } from "@/app/(data)/script";
import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";

export default async function generate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // const SHEET_ID: string = req.body.SHEET_ID;
    // const SHEET_NAME: string = req.body.SHEET_NAME;
    // const START: number = req.body.START;
    // const END: number = req.body.END;
    // const NUM_LANES: number = req.body.NUM_LANES;
    // const MIN_NUMBER_PER_GROUP: number = req.body.MIN_NUMBER_PER_GROUP;

    const SHEET_ID = "1efR3Jnc3kEVCkW4dYfhH9g7yiTZPp9DzhrlWZ1XG2y4";
    const SHEET_NAME = "Sheet1";
    const START = "A2";
    const END = "F30";
    const NUM_LANES = 5;
    const MIN_NUMBER_PER_GROUP = 3;
    const data = await parseSheetData(SHEET_ID, SHEET_NAME, START, END);

    if (!data) {
      throw new Error("Invalid data");
    }
    const groups: IGroup[][] | IGroup[] | null = await balanced_groups(
      data,
      NUM_LANES,
      MIN_NUMBER_PER_GROUP
    );
    res.status(200).json(groups);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}

const parseSheetData = async (
  SHEET_ID: string,
  SHEET_NAME: string,
  START: string,
  END: string
) => {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const range = SHEET_NAME + "!" + START + ":" + END;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range,
  });

  const sheet_data = response.data.values;
  if (!sheet_data) {
    return null;
  }
  const data = await sheet_data.map(([name, university]) => ({
    name: name,
    university: university,
  }));
  return data;
};
