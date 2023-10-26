import { IGroup } from "@/pages/utils/interfaces";
import { Card, CardContent, CardTitle } from "../ui/card";

interface CardGroupProps {
  group: IGroup[] | null;
  index: number;
}

function indexToAlphabet(index: number) {
  if (index < 0 || index >= 26) {
    return "Invalid";
  }
  return String.fromCharCode(65 + index); // A is 65 in ASCII
}
export const CardGroup: React.FC<CardGroupProps> = ({ group, index }) => {
  return (
    <>
      <Card className="p-4">
        <CardTitle className="flex justify-center m-5">
          Group {indexToAlphabet(index)}
        </CardTitle>
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
      </Card>
    </>
  );
};
