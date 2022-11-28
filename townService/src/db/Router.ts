import express, { Express } from 'express';
import {
  findScoreByID,
  getLeaders,
  insertScore,
  removeScoreFromLeaderboard,
  teamNameCurrentlyUsed,
  updateScoreValue,
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

  /*
   * Find a new score
   */
  app.get('/scores/:id', express.json(), async (req, resp) => {
    const buildResp: ScoreModifyResponse = { status: 100, data: {} };
    try {
      const teamName: string = req.params.id;
      const createdScore = await findScoreByID(teamName);
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
        buildResp.data.errorType = e.name;
        buildResp.data.errorMessage = e.message;
      }
    }
    resp.status(buildResp.status).send(buildResp.data);
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
        buildResp.data.errorType = e.name;
        buildResp.data.errorMessage = e.message;
      }
    }
    resp.status(buildResp.status).send(buildResp.data);
  });

  /**
   * Get Leaderboard
   */
  app.get('/scores/amount/:scoreNum', express.json(), async (req, resp) => {
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
  app.get('/scores/inUse/:teamName', express.json(), async (req, resp) => {
    const buildResp: TeamNameInUseResponse = { status: 100, data: {} };
    try {
      const inUse: boolean = await teamNameCurrentlyUsed(req.params.teamName);
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
