// import { NUM_LANES, MIN_NUMBER_PER_GROUP } from "./inputs";
import { IGroup } from "./interfaces";
// import { parseData } from "./parseData";

function shuffle(random_data: IGroup[] | IGroup[][] | any) {
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
  number_swimmers: number,
  NUM_LANES: number
) => {
  universities.map((university) => {
    if (university.count > 1) {
      const number_groups = Math.ceil(number_swimmers / NUM_LANES);
      university.nb_repeatitions = Math.floor(university.count / number_groups);
    }
  });
};

const get_universities = (data: IGroup[], NUM_LANES: number) => {
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
  calcul_nb_universities_repetitions(
    universities,
    data,
    data.length,
    NUM_LANES
  );
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

const isEmptyPresent = (group: IGroup[]) =>  {
  let empty = false;
  // console.log('group in is_empty_present: ', group);
  for (let j = 0; j < group.length; j++) {
    if (!group[j]) {
      empty = true;
      break;
    }
  }
  return empty;
}

const fill_groups = (
  groups: IGroup[][],
  random_data: IGroup[],
  NUM_LANES: number
) => {
  const number_swimmers = random_data.length;
  const number_groups = Math.ceil(number_swimmers / NUM_LANES);
  const universities = get_universities(random_data, NUM_LANES);

  universities.sort((u1, u2) => u2.nb_repeatitions - u1.nb_repeatitions);

  // console.log("sorted universities: ", universities);
  let index = 0;
  while (random_data.length > 0) {
    for (let i = 0; i < universities.length; i++) {
      // index = 0;
      while (universities[i].count > 0) {
        const swimmer_index = random_data.findIndex(
          (swimmer) => swimmer.university === universities[i].name
        );
        if (swimmer_index === -1) {
          break;
        }
        while (!isEmptyPresent(groups[index])) {
          index++;
          index = index % number_groups;
        }
        for (let j = 0; j < groups[index].length; j++) {
          if (!groups[index][j]) {
            groups[index][j] = random_data[swimmer_index];
            random_data.splice(swimmer_index, 1);
            universities[i].count--;
            index++;
            index = index % number_groups;
            break;
          }
        }
      }
    }
  }
};

const balanced_groups_size = (
  groups: IGroup[][],
  random_data: IGroup[],
  NUM_LANES: number,
  MIN_NUMBER_PER_GROUP: number
) => {
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

export const balanced_groups = async (
  random_data: any[],
  NUM_LANES: number,
  MIN_NUMBER_PER_GROUP: number
) => {
  if (!random_data) {
    return null;
  }
  const number_swimmers = random_data.length;
  const number_groups = Math.ceil(number_swimmers / NUM_LANES);
  const groups = new Array<IGroup[]>(number_groups);

  // Fisher-Yates shuffle algorithm.
  shuffle(random_data);
  balanced_groups_size(groups, random_data, NUM_LANES, MIN_NUMBER_PER_GROUP);
  console.log("groups: ", groups);
  fill_groups(groups, random_data, NUM_LANES);

  // for (let i = 0; i < groups.length; i++) {
  //   groups[i].sort(() => Math.random() - 0.5);
  // }
  // groups.sort(() => Math.random() - 0.5);

  console.log("groups -----------------------");
  for (let i = 0; i < groups.length; i++) {
    console.log(groups[i]);
  }
  return groups;
};
