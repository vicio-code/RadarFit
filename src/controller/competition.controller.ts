import { Request, Response } from "express";
import {
  getCompetitions,
  createCompetition,
  updateCompetition,
  createResult,
} from "../model/competition.model";
import { getRankings } from "../service/competition.service";

export async function read(_req: Request, res: Response) {
  const competitions = await getCompetitions();
  res.status(200).json(competitions);
}

export async function create(req: Request, res: Response) {
  const { name } = req.body;
  const newCompetition = await createCompetition(name.toLowerCase());
  res.status(200).json(newCompetition);
}

export async function update(req: Request, res: Response) {
  const { status } = req.body;
  const { id } = req.params;

  const updatedCopetition = await updateCompetition({
    status: status.toLowerCase(),
    id: Number(id),
  });
  res.status(200).json(updatedCopetition);
}

export async function newResult(req: Request, res: Response) {
  const { athelete, unit, value, competition } = req.body;
  const { id } = req.params;

  const newResult = await createResult({
    athelete: athelete.toLowerCase(),
    unit: unit.toLowerCase(),
    value: value.toLowerCase(),
    competitionName: competition.toLowerCase(),
    competitionId: Number(id),
  });

  res.status(200).json(newResult);
}

export async function getCompetitionRank(req: Request, res: Response) {
  const { id } = req.params;
  const { error, results } = await getRankings(Number(id));

  if (error) return res.status(400).json(error);

  res.status(200).json(results);
}
