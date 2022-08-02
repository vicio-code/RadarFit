import { PrismaClient } from "@prisma/client";
import { ICompetitionPayload, IResultPayload } from "../entities/competition";

const prisma = new PrismaClient();

async function createCompetition(name: string) {
  const newCompetition = await prisma.competition.create({
    data: {
      name,
      status: "in progress",
    },
  });
  return newCompetition;
}

async function getCompetitions() {
  const competitions = await prisma.competition.findMany();
  return competitions;
}

async function getCompetition(id: number) {
  const competition = await prisma.competition.findUnique({
    where: {
      id,
    },
    include: {
      results: true,
    },
  });
  return competition;
}

async function updateCompetition({ status, id }: ICompetitionPayload) {
  const updatedTask = await prisma.competition.update({
    where: { id },
    data: {
      status,
    },
  });
  return updatedTask;
}

async function createResult({
  competitionId,
  athelete,
  value,
  unit,
}: IResultPayload) {
  const newCompetition = await prisma.results.create({
    data: {
      competitionId,
      athelete,
      value,
      unit,
    },
  });
  return newCompetition;
}

export {
  createCompetition,
  getCompetitions,
  getCompetition,
  updateCompetition,
  createResult,
};
