import express, { Express } from 'express';
import {
  getLeaders,
  insertScore,
  removeScoreFromLeaderboard,
  updateScoreValue,
} from './LeaderboardService';
import { ScoreModifyResponse, ScoreFindResponse } from './Types';
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
        buildResp.data.error = e;
      }
    }
    resp.status(buildResp.status).send(buildResp);
  });

  /**
   * Delete a score
   */
  app.delete('/scores/:id', express.json(), async (req, resp) => {
    const buildResp: ScoreModifyResponse = { status: 100, data: {} };
    try {
      const scoreID: string = req.params.id;
      await removeScoreFromLeaderboard(scoreID);
      buildResp.status = 200;
    } catch (e) {
      if (e instanceof Error) {
        buildResp.status = 400;
        buildResp.data.error = e;
      }
    }
    resp.status(buildResp.status).send(buildResp);
  });

  /**
   * Update a score
   */
  app.post('/scores/score', express.json(), async (req, resp) => {
    const buildResp: ScoreModifyResponse = { status: 100, data: {} };
    try {
      const updatedScore: ScoreModel = req.body.scoreModel;
      const newScore: ScoreModel = await updateScoreValue(updatedScore);
      buildResp.status = 200;
      buildResp.data.score = newScore;
    } catch (e) {
      if (e instanceof Error) {
        buildResp.status = 400;
        buildResp.data.error = e;
      }
    }
    resp.status(buildResp.status).send(buildResp.data);
  });

  /**
   * Get Leaderboard
   */
  app.get('/scores/:scoreNum', express.json(), async (req, resp) => {
    const buildResp: ScoreFindResponse = { status: 100, data: {} };
    try {
      const numScores: number = parseInt(req.params.scoreNum, 10);
      const scores: ScoreModel[] = await getLeaders(numScores);
      buildResp.status = 200;
      buildResp.data.scores = scores;
    } catch (e) {
      if (e instanceof Error) {
        buildResp.status = 400;
        buildResp.data.error = e;
      }
    }
    resp.status(buildResp.status).send(buildResp.data);
  });
}
