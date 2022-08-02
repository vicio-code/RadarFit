import { Request, Response, NextFunction } from "express";
import { validCompetitions, validStatus } from "../entities/competition";
import { getCompetition } from "../model/competition.model";

function checkFilds(fieldValue: string, fieldName: string) {
  if (fieldValue === undefined) return [false, `${fieldName} is required`];
  if (typeof fieldValue !== "string")
    return [false, `${fieldName} must be a string`];
  return [true];
}

function competitionNameValidation(competition: validCompetitions) {
  const competitions = [
    validCompetitions.cHidratacao,
    validCompetitions.cYoga,
    validCompetitions.cPeso,
    validCompetitions.cDardos,
  ];
  if (!competitions.includes(competition)) {
    return [false, "Invalid competition type"];
  }
  return [true];
}

function checkStatus(status: validStatus) {
  const statusArry = [validStatus.inProgress, validStatus.done];
  if (!statusArry.includes(status)) {
    return [false, "Invalid status"];
  }
  return [true];
}

function isUnitValid(competition: validCompetitions, unit: string) {
  const validCompetitionsUnits = {
    [validCompetitions.cHidratacao]: ["ml", "l"],
    [validCompetitions.cYoga]: ["s", "m", "h"],
    [validCompetitions.cPeso]: ["cal", "kcal"],
    [validCompetitions.cDardos]: ["m", "km", "cm"],
  };
  return validCompetitionsUnits[competition].includes(unit);
}

export async function resultsValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { athelete, unit, value, competition } = req.body;

  let [isValid, message] = checkFilds(athelete, "athelete");
  if (!isValid) {
    return res.status(400).json(message);
  }

  [isValid, message] = checkFilds(unit, "unit");
  if (!isValid) {
    return res.status(400).json(message);
  }

  [isValid, message] = checkFilds(value, "value");
  if (!isValid) {
    return res.status(400).json(message);
  }

  [isValid, message] = checkFilds(competition, "competition");
  if (!isValid) {
    return res.status(400).json(message);
  }

  [isValid, message] = competitionNameValidation(competition.toLowerCase());
  if (!isValid) {
    return res.status(400).json(message);
  }

  next();
}

export async function resultsUnitValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { unit, competition } = req.body;
  if (!isUnitValid(competition.toLowerCase(), unit.toLowerCase())) {
    return res.status(400).json("Invalid unit type");
  }
  next();
}

export async function competitionValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name } = req.body;
  const parsedCompetitonName = name.toLowerCase();

  let [isValid, message] = checkFilds(parsedCompetitonName, "competition");
  if (!isValid) {
    return res.status(400).json(message);
  }
  [isValid, message] = competitionNameValidation(parsedCompetitonName);
  if (!isValid) {
    return res.status(400).json(message);
  }

  next();
}

export async function statusValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { status } = req.body;
  const parsedStatus = status.toLowerCase();

  let [isValid, message] = checkFilds(parsedStatus, "status");
  if (!isValid) {
    return res.status(400).json(message);
  }
  [isValid, message] = checkStatus(parsedStatus);
  if (!isValid) {
    return res.status(400).json(message);
  }

  next();
}

export async function newResultValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { athelete, competition } = req.body;
  const { id } = req.params;
  const competitionInfo = await getCompetition(Number(id));

  if (!competitionInfo) {
    return res.status(400).json("Invalid competition ID");
  }

  if (competitionInfo.name !== competition.toLowerCase()) {
    return res.status(400).json("Invalid competition name");
  }

  if (competitionInfo.status === "done") {
    return res.status(400).json("Competition already over");
  }

  const isNewAthelete = competitionInfo.results.filter(
    (result) => result.athelete === athelete.toLowerCase()
  );

  if (
    isNewAthelete.length >= 1 &&
    competitionInfo.name !== "competição de dardos"
  ) {
    return res.status(400).json("Athelete results already posted");
  }

  if (isNewAthelete.length >= 3) {
    return res.status(400).json("Athelete already posted 3 results");
  }

  next();
}
