import express, { Express } from 'express';
import {
  getLeaders,
  insertScore,
  isTeamNameCurrentlyUsed,
} from './LeaderboardService';
import { ScoreModifyResponse, ScoreFindResponse, TeamNameInUseResponse } from './Types';
import { ScoreModel } from '../types/CoveyTownSocket';

export default function scoreRoutes(app: Express) {
  /*
   * Create a new score
   */
  app.post('/score', express.json(), async (req, resp) => {
    const buildResp: ScoreModifyResponse = { status: 100, data: {} };
    try {
      const newScore: ScoreModel = req.body.scoreModel;
      const createdScore = await insertScore(newScore);
      buildResp.status = 200;
      buildResp.data.score = createdScore;
    } catch (e) {
      if (e instanceof Error) {
        buildResp.status = 400;
        buildResp.data.errorType = e.name;
        buildResp.data.errorMessage = e.message;
      }
    }
    resp.status(buildResp.status).send(buildResp.data);
  });

  /**
   * Get Leaderboard for todays crossword
   */
  app.get('/scores/leaderboard/:scoreNum', express.json(), async (req, resp) => {
    const buildResp: ScoreFindResponse = { status: 100, data: {} };
    try {
      const numScores: number = parseInt(req.params.scoreNum, 10);
      const scores: ScoreModel[] = await getLeaders(numScores);
      buildResp.status = 200;
      buildResp.data.scores = scores;
    } catch (e) {
      if (e instanceof Error) {
        buildResp.status = 400;
        buildResp.data.errorType = e.name;
        buildResp.data.errorMessage = e.message;
      }
    }
    resp.status(buildResp.status).send(buildResp.data);
  });

  /**
   * Get if the team name is in use
   */
  app.get('/scores/team-names/:teamName', express.json(), async (req, resp) => {
    const buildResp: TeamNameInUseResponse = { status: 100, data: {} };
    try {
      const inUse: boolean = await isTeamNameCurrentlyUsed(req.params.teamName);
      buildResp.status = 200;
      buildResp.data.inUse = inUse;
    } catch (e) {
      if (e instanceof Error) {
        buildResp.status = 400;
        buildResp.data.errorType = e.name;
        buildResp.data.errorMessage = e.message;
      }
    }
    resp.status(buildResp.status).send(buildResp.data);
  });
}
