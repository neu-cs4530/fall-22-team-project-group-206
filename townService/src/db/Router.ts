import express, { Express, request } from 'express';
import io from 'socket.io';
import { Server } from 'http';
import Score from './ScoreModel';
import { IScore } from './IScore';
import { addScore, getScores, removeScore, updateScore } from './LeaderboardDAO';

export default function scoreRoutes(http: Server, app: Express): io.Server {
  /*
   * Create a new score
   */
  app.post('/score', express.json(), async () => {
    const scoreModel : IScore = request.body
    const resp = await addScore(scoreModel)
    express.response.status(resp.status).send(resp)
  
  });

  /**
   * Delete a score
   */
  app.delete('/scores/:scoreID', express.json(), async () => {
    const scoreID : string = request.body
    const resp = await removeScore(scoreID)
    express.response.status(resp.status).send(resp)
  
  });

  /**
   * List all scores
   */
  app.get('/scores', express.json(), async () => {
    const resp = await getScores()
    express.response.status(resp.status).send(resp)

  });

    /**
   * Update a score
   */
  app.post('/scores/score', express.json(), async () => {
    const updatedScore : IScore = request.body
    const resp = await updateScore(updatedScore)
    express.response.status(resp.status).send(resp)
  });


  const socketServer = new io.Server(http, { cors: { origin: '*' } });
  return socketServer;
}