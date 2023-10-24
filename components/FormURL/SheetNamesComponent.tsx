import { IGroup } from "@/app/(data)/interfaces";
import axios from "axios";
import { createRef, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Button } from "../ui/button";
import { CardGroup } from "./CardGroup";
import { Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import * as htmlToImage from "html-to-image";

interface SheetNamesComponentProps {
  sheetId: string;
  sheetNames: string[];
}

// type QueryResult<T> = {
//   isLoading: boolean;
//   isError: boolean;
//   data: T;
//   error: any;
// };

const createFileName = (extension = "", ...names: string[]) => {
  if (!extension) {
    return "";
  }

  return `${names.join("")}.${extension}`;
};

export const SheetNamesComponent: React.FC<SheetNamesComponentProps> = ({
  sheetId,
  sheetNames,
}) => {
  // const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheetValue, setSelectedSheetValue] = useState<string>("");
  const [START, setSTART] = useState<string>("A2");
  const [END, setEND] = useState<string>("F30");
  const [NUM_LANES, setNUM_LANES] = useState<number>(5);
  const [MIN_NUMBER_PER_GROUP, setMIN_NUMBER_PER_GROUP] = useState<number>(3);
  const [title, setTitle] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);

  const takeScreenShot = async (node: any) => {
    const dataURI = await htmlToImage.toJpeg(node);
    return dataURI;
  };

  const download = (
    image: string,
    { name = "img", extension = "jpg" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };
  // const sheetNamesQuery: QueryResult<any> = useQuery("sheetNames", async () => {
  //   if (!sheetId) return;
  //   const response = await axios.post("/api/sheetNames", { sheetId });
  //   setSheetNames(response.data);
  //   setSelectedSheetValue(response.data[0]);
  //   return response.data;
  // });

  useEffect(() => {
    if (!sheetId) return;
    console.log("test: ", sheetNames);
    setSelectedSheetValue(sheetNames[0]);
  }, [sheetId]);
  const generateMutation = useMutation(async () => {
    if (!sheetId) return;
    const response = await axios.post("/api/generate", {
      sheetId,
      selectedSheetValue,
      NUM_LANES,
      MIN_NUMBER_PER_GROUP,
      START,
      END,
    });
    return response.data;
  });

  const runScript = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    generateMutation.mutate();
  };
  return (
    <>
      {/* {sheetNamesQuery.isLoading && <p>Loading...</p>}
      {sheetNamesQuery.isError && <p>Error: {sheetNamesQuery.error.message}</p>} */}
      <div className="w-auto mt-10 ">
        <form
          onSubmit={runScript}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="flex flex-row mb-6 items-center">
            <label
              htmlFor="sheet"
              className="flex-shrink-0 w-1/3 text-md font-medium text-gray-900"
            >
              Sheet:{" "}
            </label>
            <select
              id="sheet"
              className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              value={selectedSheetValue}
              onChange={(event) => setSelectedSheetValue(event.target.value)}
              required
            >
              {sheetNames?.map((name) => (
                <option value={name} key={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-row mb-6 items-center">
            <label
              htmlFor="nb_lanes"
              className="flex-shrink-0 w-1/3 text-md font-medium text-gray-900"
            >
              Number per group:{" "}
            </label>
            <input
              type="number"
              value={NUM_LANES}
              onChange={(event) => setNUM_LANES(parseInt(event.target.value))}
              required
              className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-row mb-6 items-center">
            <label
              htmlFor="start"
              className="flex-shrink-0 w-1/3 text-md font-medium text-gray-900"
            >
              Start cell:{" "}
            </label>
            <input
              type="text"
              value={START}
              onChange={(event) => setSTART(event.target.value)}
              required
              className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-row mb-6 items-center">
            <label
              htmlFor="end"
              className="flex-shrink-0 w-1/3 text-md font-medium text-gray-900"
            >
              End cell:{" "}
            </label>
            <input
              type="text"
              value={END}
              onChange={(event) => setEND(event.target.value)}
              required
              className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-row mb-6 items-center">
            <label
              htmlFor="min_number_per_group"
              className="flex-shrink-0 w-1/3 text-md font-medium text-gray-900"
            >
              Min number per group:{" "}
            </label>
            <input
              type="number"
              value={MIN_NUMBER_PER_GROUP}
              onChange={(event) =>
                setMIN_NUMBER_PER_GROUP(parseInt(event.target.value))
              }
              required
              className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-row items-center">
            <label
              htmlFor="title"
              className="flex-shrink-0 w-1/3 text-md font-medium text-gray-900"
            >
              Title:{" "}
            </label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-center mt-7">
            <Button className="w-[150px]" type="submit">
              Generate
            </Button>
          </div>
        </form>
      </div>
      {sheetId && generateMutation.isLoading && (
        <div
          className={`fixed inset-0 flex items-center justify-center backdrop-blur-lg ${
            generateMutation.isLoading ? "block" : "hidden"
          }`}
        >
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {sheetId && generateMutation.data && title && (
        <div className="flex items-center justify-center m-4 mt-[100px]">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
      )}
      <div
        className="flex flex-row justify-between flex-wrap w-2/3 mt-10"
        ref={ref}
      >
        {sheetId &&
          generateMutation.data &&
          generateMutation.data.map((group: IGroup[] | null, index: number) => (
            <div key={index} className="m-8 w-[300px]">
              <CardGroup key={index} group={group} index={index} />
            </div>
          ))}
      </div>
      {sheetId && generateMutation.data && (
        <div className="flex items-center justify-center mt-[80px] mb-[100px]">
          <Button
            className="w-[150px]"
            onClick={() => {
              takeScreenShot(ref.current).then(download);
            }}
          >
            Screenshot
          </Button>
        </div>
      )}
    </>
  );
};
