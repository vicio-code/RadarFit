import { Router } from "express";
import {
  create,
  read,
  update,
  newResult,
  getCompetitionRank,
} from "../controller/competition.controller";
import {
  resultsValidation,
  resultsUnitValidation,
  competitionValidation,
  statusValidation,
  newResultValidation,
} from "../middlewares/competitionValidation";

const router = Router();

router.post("/competition", competitionValidation, create);
router.get("/competition", read);
router.get("/competition/:id", getCompetitionRank);
router.put("/competition/:id", statusValidation, update);
router.post(
  "/competition/:id/results",
  resultsValidation,
  resultsUnitValidation,
  newResultValidation,
  newResult
);

export default router;
