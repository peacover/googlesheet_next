import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";

interface SheetNamesComponentProps {
  sheetId: string;
}

type QueryResult<T> = {
  isLoading: boolean;
  isError: boolean;
  data: T;
  error: any;
};

export const SheetNamesComponent: React.FC<SheetNamesComponentProps> = ({
  sheetId,
}) => {
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedValue, setselectedValue] = useState<string>("");
  const [START, setSTART] = useState<string>("A2");
  const [END, setEND] = useState<string>("F30");
  const [NUM_LANES, setNUM_LANES] = useState<number>(5);
  const [MIN_NUMBER_PER_GROUP, setMIN_NUMBER_PER_GROUP] = useState<number>(3);

  const sheetNamesQuery: QueryResult<any> = useQuery("sheetNames", async () => {
    const response = await axios.post("/api/sheetNames", { sheetId });
    setSheetNames(response.data);
    setselectedValue(response.data[0]);
    return response.data;
  });
  // const dataQuery: QueryResult<any> = useQuery("Data", async () => {
  //   const response = await axios.post("/api/generate", {
  //     sheetId,
  //     sheetNames,
  //     NUM_LANES,
  //     MIN_NUMBER_PER_GROUP,
  //     START,
  //     END,
  //   });
  //   return response.data;
  // });

  const runScript = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  return (
    <>
      {sheetNamesQuery.isLoading && <p>Loading...</p>}
      {sheetNamesQuery.isError && <p>Error: {sheetNamesQuery.error.message}</p>}
      {sheetNamesQuery.data && !sheetNamesQuery.isLoading && (
        <form onSubmit={runScript}>
          <label htmlFor="sheet">Sheet: </label>
          <select
            id="sheet"
            value={selectedValue}
            onChange={(event) => setselectedValue(event.target.value)}
            required
          >
            {sheetNames.map((name) => (
              <option value={name}>{name}</option>
            ))}
          </select>
          <label htmlFor="nb_lanes">Number of lanes: </label>
          <input
            type="number"
            value={NUM_LANES}
            onChange={(event) => setNUM_LANES(parseInt(event.target.value))}
            required
          />
          <label htmlFor="start">Start cell: </label>
          <input
            type="text"
            value={START}
            onChange={(event) => setSTART(event.target.value)}
            required
          />
          <label htmlFor="end">End cell: </label>
          <input
            type="text"
            value={END}
            onChange={(event) => setEND(event.target.value)}
            required
          />
          <label htmlFor="min_number_per_group">Min number per group: </label>
          <input
            type="number"
            value={MIN_NUMBER_PER_GROUP}
            onChange={(event) =>
              setMIN_NUMBER_PER_GROUP(parseInt(event.target.value))
            }
            required
          />
          <input type="submit" value="Generate" />
          <input type="reset" value="Reset" />
        </form>
      )}
      {/* {dataQuery.isLoading && <p>Loading...</p>}
      {dataQuery.isError && <p>Error: {dataQuery.error.message}</p>}
      {dataQuery.data && !dataQuery.isLoading && (
        <div>
          <h1>Group 1</h1>
          <ul>
            {Array.isArray(dataQuery.data) &&
              dataQuery.data.map((swimmer, index) => (
                <li key={index}>
                  {swimmer.name} | {swimmer.university}
                </li>
              ))}
          </ul>
        </div>
      )} */}
    </>
  );
};
