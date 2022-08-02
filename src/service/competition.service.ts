import { Results } from "@prisma/client";
import { getCompetition } from "../model/competition.model";

// switch case && notMutation
function convertUnits(results: Results[], name: string) {
  results.forEach((result) => {
    if (result.unit === "ml") {
      result.value = String(Number(result.value) / 1000);
      result.unit = "l";
    }
    if (result.unit === "m" && name === "competição de yoga") {
      result.value = String(Number(result.value) * 60);
      result.unit = "s";
    }
    if (result.unit === "h") {
      result.value = String(Number(result.value) * 3600);
      result.unit = "s";
    }
    if (result.unit === "cal") {
      result.value = String(Number(result.value) / 1000);
      result.unit = "kcal";
    }
    if (result.unit === "cm") {
      result.value = String(Number(result.value) / 100);
      result.unit = "m";
    }
    if (result.unit === "km") {
      result.value = String(Number(result.value) * 1000);
      result.unit = "m";
    }
  });
}

function sortDartCompetition(sortedResults: Results[]) {
  const filteredResult: Array<any> = [];
  const atheleteNames: { [key: string]: string } = {};

  sortedResults.forEach((result) => {
    if (!atheleteNames[result.athelete]) {
      atheleteNames[result.athelete] = result.athelete;
      filteredResult.push(result);
    }
  });
  return filteredResult;
}

function createRanking(sortedResults: Results[]) {
  const ranking = [];
  let position = 1;
  let prevValue = sortedResults[0].value;

  for (let index = 0; index < sortedResults.length; index++) {
    const result = sortedResults[index];

    if (prevValue === result.value) {
      ranking.push({ ...result, position });
      prevValue = result.value;
      continue;
    }

    ranking.push({ ...result, position });
    prevValue = result.value;
    position = ranking.length + 1;
  }
  return ranking;
}

export async function getRankings(id: number) {
  const competition = await getCompetition(id);
  if (!competition)
    return { results: undefined, error: "Invalid competition ID" };

  const { results, name } = competition;
  convertUnits(results, name);

  let sortedResults = results
    .sort((a, b) => Number(a.value) - Number(b.value))
    .reverse();

  if (competition.name === "competição de dardos") {
    sortedResults = sortDartCompetition(sortedResults);
  }

  const ranking = createRanking(sortedResults);

  return {
    results: ranking,
    error: undefined,
  };
}
