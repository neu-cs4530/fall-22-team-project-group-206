import express, { Express } from 'express';
import io from 'socket.io';
import { Server } from 'http';

export default function scoreRoutes(http: Server, app: Express): io.Server {
  /*
   * Create a new score
   */
  app.post('/score', express.json(), async () => {

  });

  /**
   * Delete a score
   */
  app.delete('/scores/:scoreID', express.json(), async () => {

  });

  /**
   * List all scores
   */
  app.get('/scores', express.json(), async () => {

  });

    /**
   * Update a score
   */
  app.post('/scores/scoreID', express.json(), async () => {

  });


  const socketServer = new io.Server(http, { cors: { origin: '*' } });
  return socketServer;
}