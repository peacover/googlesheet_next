import { IGroup } from "./(data)/interfaces";
import { parseData } from "./(data)/parseData";
import { balanced_groups } from "./(data)/script";


export default async function Home() {
  const data : IGroup[][]| null = await balanced_groups();
  
  if (!data) {
    return <p>NO DATA IN THE SHEET!!</p>;
  }

  return (
    <>
      {data.map((group, index) => (
        <div key={index}>
          <h1>Group {index + 1}</h1>
          <ul>
            {Array.isArray(group) &&
              group.map((swimmer, index) => (
                <li key={index}>
                  {swimmer.name} | {swimmer.university}
                </li>
              ))}
          </ul>
          <br/>
        </div>
      ))}
      <p>test</p>
    </>
  );
}
