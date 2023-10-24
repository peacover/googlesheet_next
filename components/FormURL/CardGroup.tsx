import { IGroup } from "@/app/(data)/interfaces";
import { Card, CardContent, CardTitle } from "../ui/card";

interface CardGroupProps {
  group: IGroup[] | null;
  index: number;
  ref?: React.RefObject<HTMLDivElement> | null;
}

function indexToAlphabet(index: number) {
  if (index < 0 || index >= 26) {
    return "Invalid";
  }
  return String.fromCharCode(65 + index); // A is 65 in ASCII
}
export const CardGroup: React.FC<CardGroupProps> = ({ group, index, ref }) => {
  return (
    <>
      <Card className="p-4">
        <CardTitle className="flex justify-center m-5">
          <h1>Group {indexToAlphabet(index)}</h1>
        </CardTitle>
        {/* <CardContent> */}
          <ul>
            {group &&
              group.map((swimmer, i) => (
                <li className="pl-2" key={i}>
                  {i + 1}. {swimmer?.name}{" "}
                  {swimmer?.name && swimmer?.university ? "| " : " "}
                  {swimmer?.university}
                </li>
              ))}
          </ul>
        {/* </CardContent> */}
      </Card>
    </>
  );
};
