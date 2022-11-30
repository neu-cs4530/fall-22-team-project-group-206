import express, { Express } from 'express';
import { getLeaders, insertScore, isTeamNameUsed } from '../LeaderboardService';
import {
  ScoreModifyResponse,
  ScoreFindResponse,
  TeamNameInUseResponse,
  ScoreModel,
} from '../../types/CoveyTownSocket';
import InvalidParametersError from '../../lib/InvalidParametersError';
import NotFoundError from '../DatabaseErrors/NotFoundError';
import UndefinedError from '../DatabaseErrors/UndefinedError';

export default function scoreRoutes(app: Express) {
  function buildErrorResp(
    err: Error,
    buildResp: TeamNameInUseResponse | ScoreFindResponse | ScoreModifyResponse,
  ) {
    if (err instanceof NotFoundError || err instanceof UndefinedError) {
      buildResp.status = 404;
      buildResp.data.errorType = err.name;
      buildResp.data.errorMessage = err.message;
    } else {
      buildResp.status = 400;
      buildResp.data.errorType = err.name;
      buildResp.data.errorMessage = err.message;
    }
  }
  /*
   * Create a new score
   */
  app.post('/score', express.json(), async (req, resp) => {
    const buildResp: ScoreModifyResponse = { status: 100, data: {} };
    try {
      const newScore: ScoreModel = req.body.scoreModel;
      if (!newScore) {
        throw new InvalidParametersError(
          `Could not find scoreModel within request. Request body must be of type InsertScoreRequestBody`,
        );
      }
      const createdScore = await insertScore(newScore);
      buildResp.status = 201;
      buildResp.data.score = createdScore;
    } catch (err) {
      if (err instanceof Error) {
        buildErrorResp(err, buildResp);
      }
    }
    resp.status(buildResp.status).send(buildResp.data);
  });

  /**
   * Get Leaderboard for todays crossword
   */
  app.get('/scores/amount/:scoreNum', express.json(), async (req, resp) => {
    const buildResp: ScoreFindResponse = { status: 100, data: {} };
    try {
      const numScores: number = parseInt(req.params.scoreNum, 10);
      if (Number.isNaN(numScores)) {
        throw new InvalidParametersError(
          `Amount of scores must be a numeric value. Instead Received: ${req.params.scoreNum}`,
        );
      }
      const scores: ScoreModel[] = await getLeaders(numScores);
      buildResp.status = 200;
      buildResp.data.scores = scores;
    } catch (err) {
      if (err instanceof Error) {
        buildErrorResp(err, buildResp);
      }
    }
    resp.status(buildResp.status).send(buildResp.data);
  });

  /**
   * Get if the team name is in use
   */
  app.get('/scores/teams/:teamName', express.json(), async (req, resp) => {
    const buildResp: TeamNameInUseResponse = { status: 100, data: {} };
    try {
      const inUse: boolean = await isTeamNameUsed(req.params.teamName);
      buildResp.status = 200;
      buildResp.data.inUse = inUse;
    } catch (err) {
      if (err instanceof Error) {
        buildErrorResp(err, buildResp);
      }
    }
    resp.status(buildResp.status).send(buildResp.data);
  });
}
