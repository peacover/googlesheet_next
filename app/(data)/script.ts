import { IGroup } from "./interfaces";

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

const get_universities = (data: IGroup[], NUM_LANES: number) => {
  const universities = new Array<{
    name: string;
    count: number;
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
        });
      } else {
        universities[index].count++;
      }
    }
  });
  return universities;
};

const isEmptyPresent = (group: IGroup[]) =>  {
  let empty = false;
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

  universities.sort((u1, u2) => u2.count - u1.count);

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
  fill_groups(groups, random_data, NUM_LANES);

  for (let i = 0; i < groups.length; i++) {
    groups[i].sort(() => Math.random() - 0.5);
  }
  groups.sort(() => Math.random() - 0.5);

  // console.log("groups -----------------------");
  // for (let i = 0; i < groups.length; i++) {
  //   console.log(groups[i]);
  // }
  return groups;
};
