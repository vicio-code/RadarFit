import { Results } from "@prisma/client";
import { getCompetition } from "../model/competition.model";

function convertUnits(results: Results[], name: string) {
  return results.map((result) => {
    if (result.unit === "ml") {
      return {
        ...result,
        value: String(Number(result.value) / 1000),
        unit: "l",
      };
    }
    if (result.unit === "m" && name === "competição de yoga") {
      return {
        ...result,
        value: String(Number(result.value) * 60),
        unit: "s",
      };
    }
    if (result.unit === "h") {
      return {
        ...result,
        value: String(Number(result.value) * 3600),
        unit: "s",
      };
    }
    if (result.unit === "cal") {
      return {
        ...result,
        value: String(Number(result.value) / 1000),
        unit: "kcal",
      };
    }
    if (result.unit === "cm") {
      return {
        ...result,
        value: String(Number(result.value) / 100),
        unit: "m",
      };
    }
    if (result.unit === "km") {
      return {
        ...result,
        value: String(Number(result.value) * 1000),
        unit: "m",
      };
    }
    return { ...result };
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
      prevValue = result.value;
      ranking.push({ ...result, position });
      continue;
    }

    prevValue = result.value;
    position = ranking.length + 1;
    ranking.push({ ...result, position });
  }
  return ranking;
}

export async function getRankings(id: number) {
  const competition = await getCompetition(id);
  if (!competition)
    return { results: undefined, error: "Invalid competition ID" };

  const { results, name } = competition;
  const convertedResults = convertUnits(results, name);

  let sortedResults = convertedResults
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
