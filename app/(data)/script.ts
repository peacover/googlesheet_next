import { NUM_LANES, MIN_NUMBER_PER_GROUP } from "./inputs";
import { IGroup } from "./interfaces";
import { parseData } from "./parseData";

function shuffle(random_data: IGroup[]) {
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

const check_duplicated_university = (group : any[], university : string, start_index : number) => {
  for (let i = start_index; i < group.length; i++) {
    if (group[i] && group[i].university && group[i].university.includes(university, i)) {
      return true;
    }
  }
  return false;
};

const fill_groups = (groups: IGroup[][], random_data: IGroup[]) => {
  const number_swimmers = random_data.length;
  const number_groups = Math.ceil(number_swimmers / NUM_LANES);

  while (random_data.length > 0) {
    for (let i = 0; i < number_groups; i++) {
      for (let j = 0; j < groups[i].length; j++) {
        if (!groups[i][j]) {
          if (groups[i][j] && groups[i][j].university && check_duplicated_university(groups[i], groups[i][j].university, j)) {
            break;
          }
          groups[i][j] = random_data[0];          
          random_data.splice(0, 1);
        }
      }
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

// Fisher-Yates shuffle algorithm.
shuffle(random_data);

const groups = new Array<IGroup[]>(number_groups);

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

fill_groups(groups, random_data);

return groups;

};
