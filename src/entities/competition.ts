export enum validCompetitions {
  cHidratacao = "competição de hidratação",
  cYoga = "competição de yoga",
  cPeso = "competição de perda de peso",
  cDardos = "competição de dardos",
}

export enum validStatus {
  inProgress = "in progress",
  done = "done",
}

export interface ICompetitionPayload {
  id: number;
  status: string;
}

export interface IResultPayload {
  competitionId: number;
  athelete: string;
  value: string;
  unit: string;
  competitionName: validCompetitions;
}
