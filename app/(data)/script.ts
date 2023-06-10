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

// const check_duplicated_university = (group : any[], university : string, start_index : number) => {
//   for (let i = start_index; i < group.length; i++) {
//     if (group[i] && group[i].university && group[i].university.includes(university, i)) {
//       return true;
//     }
//   }
//   return false;
// };

const calcul_nb_universities_repetitions = (universities: { name: string; count: number, nb_repeatitions: number }[]) => {
  universities.map((university) => {
    if (university.count > 1) {
      university.nb_repeatitions = Math.ceil(university.count / NUM_LANES);
    }
  });
}


const get_universities = (data: IGroup[]) => {
  const universities = new Array<{ name: string; count: number, nb_repeatitions: number }>();
  data.forEach((swimmer) => {
    if (swimmer.university) {
      const index = universities.findIndex((university) => university.name === swimmer.university);
      if (index === -1) {
        universities.push({ name: swimmer.university, count: 1, nb_repeatitions: 0 });
      } else {
        universities[index].count++;
      }
    }
  });
  calcul_nb_universities_repetitions(universities);
  return universities;
}

const fill_groups = (groups: IGroup[][], random_data: IGroup[]) => {
  // const random_data = new Array<IGroup>(...data);
  const number_swimmers = random_data.length;
  const number_groups = Math.ceil(number_swimmers / NUM_LANES);
  const universities = get_universities(random_data);

  // for (let i = 0; i < universities.length; i++) {
  //   console.log("university: ", universities[i].name, universities[i].count, universities[i].nb_repeatitions);
  // }

  // while (random_data.length > 0) {
  //   for (let i = 0; i < number_groups; i++) {
  //     for (let j = 0; j < groups[i].length; j++) {
  //       if (!groups[i][j]) {
  //         // if (random_data[0].university && check_duplicated_university(groups[i], random_data[0].university, 0)) {
  //         //   break;
  //         // }
  //         groups[i][j] = random_data[0];          
  //         random_data.splice(0, 1);
  //       }
  //     }
  //   }
  // }

  while (random_data.length > 0) {
    for (let i = 0; i < number_groups; i++) {
      for (let j = 0; j < groups[i].length; j++) {
        if (!groups[i][j]) {
          // if (random_data[0].university) {
          //   const index = universities.findIndex((university) => university.name === random_data[0].university);
            
          // }
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
