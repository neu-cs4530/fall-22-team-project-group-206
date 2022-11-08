import express, { Express, request } from 'express';
import io from 'socket.io';
import { Server } from 'http';
import { IScore } from './IScore';
import {
  getLeaders,
  insertScore,
  removeScoreFromLeaderboard,
  updateScoreValue,
  getAllScores,
} from './LeaderboardService';
import { ScoreCreateResponse, ScoreDeleteResponse, ScoreFindResponse } from '../Types';
import { ScoreModel } from './ScoreModel';

export default function scoreRoutes(http: Server, app: Express): io.Server {
  /*
   * Create a new score
   */
  app.post('/score', express.json(), async () => {
    const newScore: ScoreModel = request.body.scoreModel;
    const resp: ScoreCreateResponse = { status: 100 };

    await insertScore(newScore);
    try {
      const createdScore = await insertScore(newScore);
      resp.status = 200;
      resp.score = createdScore;
    } catch (e) {
      if (e instanceof Error) {
        resp.status = 400;
        resp.error = e;
      }
    }
    express.response.status(resp.status).send(resp);
  });

  /**
   * Delete a score
   */
  app.delete('/scores/:id', express.json(), async () => {
    const scoreID: string = request.params.id;
    const resp: ScoreDeleteResponse = { status: 100 };
    try {
      await removeScoreFromLeaderboard(scoreID);
      resp.status = 200;
    } catch (e) {
      if (e instanceof Error) {
        resp.status = 400;
        resp.error = e;
      }
    }
    express.response.status(resp.status).send(resp);
  });

  /**
   * List all scores
   */
  app.get('/scores', express.json(), async () => {
    const resp: ScoreFindResponse = { status: 100 };
    try {
      const scores: IScore[] = await getAllScores();
      resp.status = 200;
      resp.scores = scores;
    } catch (e) {
      if (e instanceof Error) {
        resp.status = 400;
        resp.error = e;
      }
    }
    express.response.status(resp.status).send(resp);
  });

  /**
   * Update a score
   */
  app.post('/scores/score', express.json(), async () => {
    const updatedScore: ScoreModel = request.body.scoreModel;
    const resp: ScoreCreateResponse = { status: 100 };
    try {
      const newScore: IScore = await updateScoreValue(updatedScore);
      resp.status = 200;
      resp.score = newScore;
    } catch (e) {
      if (e instanceof Error) {
        resp.status = 400;
        resp.error = e;
      }
    }
    express.response.status(resp.status).send(resp);
  });

  /**
   * Get Leaderboard
   */
  app.get('/scores/:scoreNum', express.json(), async () => {
    const numScores: number = parseInt(request.params.scoreNum, 10);
    const resp: ScoreFindResponse = { status: 100 };
    try {
      const scores: IScore[] = await getLeaders(numScores);
      resp.status = 200;
      resp.scores = scores;
    } catch (e) {
      if (e instanceof Error) {
        resp.status = 400;
        resp.error = e;
      }
    }
    express.response.status(resp.status).send(resp);
  });

  const socketServer = new io.Server(http, { cors: { origin: '*' } });
  return socketServer;
}
