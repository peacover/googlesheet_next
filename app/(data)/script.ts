import { NUM_LANES, MIN_NUMBER_PER_GROUP } from "./inputs";
import { IGroup } from "./interfaces";
import { parseData } from "./parseData";

function shuffle(random_data : IGroup[] | IGroup[][] | any) {
  let currentIndex = random_data.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [random_data[currentIndex], random_data[randomIndex]] = [
      random_data[randomIndex],
      random_data[currentIndex],
    ];
  }
  return random_data;
}

const calcul_nb_universities_repetitions = (
  universities: { name: string; count: number; nb_repeatitions: number }[],
  data: IGroup[],
  number_swimmers: number
) => {
  universities.map((university) => {
    if (university.count > 1) {
      const number_groups = Math.ceil(number_swimmers / NUM_LANES);
      university.nb_repeatitions = Math.floor(university.count / number_groups);
    }
  });
};

const get_universities = (data: IGroup[]) => {
  const universities = new Array<{
    name: string;
    count: number;
    nb_repeatitions: number;
  }>();
  data.forEach((swimmer) => {
    if (swimmer.university) {
      const index = universities.findIndex(
        (university) => university.name === swimmer.university
      );
      if (index === -1) {
        universities.push({
          name: swimmer.university,
          count: 1,
          nb_repeatitions: 0,
        });
      } else {
        universities[index].count++;
      }
    }
  });
  calcul_nb_universities_repetitions(universities, data, data.length);
  // for (let i = 0; i < universities.length; i++) {
  //   console.log(
  //     "university: ",
  //     universities[i].name,
  //     universities[i].count,
  //     universities[i].nb_repeatitions
  //   );
  // }
  return universities;
};

const fill_groups = (groups: IGroup[][], random_data: IGroup[]) => {
  const number_swimmers = random_data.length;
  const number_groups = Math.ceil(number_swimmers / NUM_LANES);
  const universities = get_universities(random_data);

  universities.sort((u1, u2) => u2.nb_repeatitions - u1.nb_repeatitions);

  // while (random_data.length > 0) {
  //   for (let i = 0; i < number_groups; i++) {
  //     for (let j = 0; j < groups[i].length; j++) {
  //       if (!groups[i][j] && random_data[0] && random_data[0].university) {
  //         const index = universities.findIndex(
  //           (university) =>
  //             university.name === random_data[0].university &&
  //             university.nb_repeatitions > 0
  //         );
  //         // console.log("index: ", index);
  //         if (universities[index]) {
  //           // get_repeted_university_and_delete(universities[index].name);
  //           for (let k = 0; k < universities[index].nb_repeatitions; k++) {

  //           }
  //         } else {
  //           groups[i][j] = random_data[0];
  //           random_data.splice(0, 1);
  //         }
  //       }
  //     }
  //   }
  // }

  let index = 0;
  while(random_data.length)
  {
    for (let i = 0; i < universities.length; i++) {
      while (index <= universities[i].count) {
        const swimmer_index = random_data.findIndex(
          (swimmer) => swimmer.university === universities[i].name
        );
        if (swimmer_index === -1) {
          break;
        }
        for (let j = 0; j < groups[index].length; j++) {
          if (!groups[index][j]) {
            groups[index][j] = random_data[swimmer_index];
            random_data.splice(swimmer_index, 1);
            index++;
            index = index % number_groups;
            break;
          }
        }
        // groups[index].push(random_data[swimmer_index]);
        // random_data.splice(swimmer_index, 1);
        // index++;
        // index = index % number_groups;
      }
    }
  }
};

const balanced_groups_size = (groups: IGroup[][], random_data: IGroup[]) => {
  const number_swimmers = random_data.length;
  const number_groups = Math.ceil(number_swimmers / NUM_LANES);
  for (let i = 0; i < number_groups; i++) {
    groups[i] = new Array(MIN_NUMBER_PER_GROUP);
  }

  var rest_swimmers = number_swimmers - number_groups * MIN_NUMBER_PER_GROUP;
  const added_swimmers = Math.floor(
    rest_swimmers / (NUM_LANES - MIN_NUMBER_PER_GROUP)
  );

  for (let i = 0; i < number_groups; i++) {
    if (i < added_swimmers) {
      groups[i] = new Array(NUM_LANES);
      rest_swimmers -= NUM_LANES - MIN_NUMBER_PER_GROUP;
    } else if (rest_swimmers > 0) {
      groups[i] = new Array(MIN_NUMBER_PER_GROUP + rest_swimmers);
      rest_swimmers = 0;
      break;
    }
  }
};

export const balanced_groups = async () => {
  const random_data = await parseData();

  if (!random_data) {
    return null;
  }
  const number_swimmers = random_data.length;
  const number_groups = Math.ceil(number_swimmers / NUM_LANES);
  const groups = new Array<IGroup[]>(number_groups);

  // Fisher-Yates shuffle algorithm.
  shuffle(random_data);
  balanced_groups_size(groups, random_data);
  fill_groups(groups, random_data);

  for (let i = 0; i < groups.length; i++) {
    groups[i].sort(() => Math.random() - 0.5);
  }
  groups.sort(() => Math.random() - 0.5);
  // console.log("------------------------------------");
  // for (let i = 0; i < groups.length; i++) {
  //   console.log(groups[i]);
  // }
  return groups;
};
