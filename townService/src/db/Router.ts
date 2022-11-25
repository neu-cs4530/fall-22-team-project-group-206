import express, { Express } from 'express';
import { Server as SocketServer } from 'socket.io';
import { Server } from 'http';
import { IScore } from './IScore';
import {
  getLeaders,
  insertScore,
  removeScoreFromLeaderboard,
  updateScoreValue,
} from './LeaderboardService';
import { ScoreCreateResponse, ScoreDeleteResponse, ScoreFindResponse } from './Types';
import { ScoreModel } from '../types/CoveyTownSocket';

export default function scoreRoutes(http: Server, app: Express): SocketServer {
  /*
   * Create a new score
   */
  app.post('/score', express.json(), async (req, resp) => {
    const buildResp: ScoreCreateResponse = { status: 100 };
    try {
      const newScore: ScoreModel = req.body.scoreModel;
      const createdScore = await insertScore(newScore);
      buildResp.status = 200;
      buildResp.score = createdScore;
    } catch (e) {
      if (e instanceof Error) {
        buildResp.status = 400;
        buildResp.error = e;
      }
    }
    resp.status(buildResp.status).send(buildResp);
  });

  /**
   * Delete a score
   */
  app.delete('/scores/:id', express.json(), async (req, resp) => {
    const buildResp: ScoreDeleteResponse = { status: 100 };
    try {
      const scoreID: string = req.params.id;
      await removeScoreFromLeaderboard(scoreID);
      buildResp.status = 200;
    } catch (e) {
      if (e instanceof Error) {
        buildResp.status = 400;
        buildResp.error = e;
      }
    }
    resp.status(buildResp.status).send(buildResp);
  });

  /**
   * Update a score
   */
  app.post('/scores/score', express.json(), async (req, resp) => {
    const buildResp: ScoreCreateResponse = { status: 100 };
    try {
      const updatedScore: ScoreModel = req.body.scoreModel;
      const newScore: ScoreModel = await updateScoreValue(updatedScore);
      buildResp.status = 200;
      buildResp.score = newScore;
    } catch (e) {
      if (e instanceof Error) {
        buildResp.status = 400;
        buildResp.error = e;
      }
    }
    resp.status(buildResp.status).send(buildResp);
  });

  /**
   * Get Leaderboard
   */
  app.get('/scores/:scoreNum', express.json(), async (req, resp) => {
    const buildResp: ScoreFindResponse = { status: 100 };
    try {
      const numScores: number = parseInt(req.params.scoreNum, 10);
      const scores: ScoreModel[] = await getLeaders(numScores);
      buildResp.status = 200;
      buildResp.scores = scores;
    } catch (e) {
      if (e instanceof Error) {
        buildResp.status = 400;
        buildResp.error = e;
      }
    }
    resp.status(buildResp.status).send(buildResp);
  });

  const socketServer = new SocketServer(http, { cors: { origin: '*' } });
  return socketServer;
}
