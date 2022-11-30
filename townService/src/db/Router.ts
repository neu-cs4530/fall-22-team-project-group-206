import express, { Express } from 'express';
import {
  getLeaders,
  insertScore,
  isTeamNameAvailable,
} from './LeaderboardService';
import { ScoreModifyResponse, ScoreFindResponse, TeamNameInUseResponse } from './Types';
import { ScoreModel } from '../types/CoveyTownSocket';
import { ValidateError } from 'tsoa';
import InvalidParametersError from '../lib/InvalidParametersError';
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import { NotFoundError, UndefinedError } from './DatabaseErrors';

export default function scoreRoutes(app: Express) {
  /*
   * Create a new score
   */
  app.post('/score', express.json(), async (req, resp) => {
    const buildResp: ScoreModifyResponse = { status: 100, data: {} };
    try {
      const newScore: ScoreModel = req.body.scoreModel;
      if (!newScore) {
        throw new InvalidParametersError('Could not find scoreModel within request. Request body must be of type InsertScoreRequestBody')
      }
      const createdScore = await insertScore(newScore);
      buildResp.status = 201;
      buildResp.data.score = createdScore;
    } catch (err) {
      buildErrorResp(err, buildResp)
     
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
      if (numScores === NaN) {
        throw new InvalidParametersError(`Amount of scores must be a numeric value. Instead Received: ${req.params.scoreNum}`)
      }
      const scores: ScoreModel[] = await getLeaders(numScores);
      buildResp.status = 200;
      buildResp.data.scores = scores;
    } catch (err) {
      buildErrorResp(err, buildResp)
    }
    resp.status(buildResp.status).send(buildResp.data);
  });

  /**
   * Get if the team name is in use
   */
  app.get('/scores/teams/:teamName', express.json(), async (req, resp) => {
    const buildResp: TeamNameInUseResponse = { status: 100, data: {} };
    try {
      const inUse: boolean = await isTeamNameAvailable(req.params.teamName);
      buildResp.status = 200;
      buildResp.data.inUse = inUse;
    } catch (err) {
      buildErrorResp(err, buildResp)
      }
    resp.status(buildResp.status).send(buildResp.data);
  });

  function buildErrorResp(err: any, buildResp: TeamNameInUseResponse | ScoreFindResponse | ScoreModifyResponse) {
    if (err instanceof NotFoundError || err instanceof UndefinedError) {
      buildResp.status = 404;
      buildResp.data.errorType = err.name;
      buildResp.data.errorMessage = err.message;
    }
    else if (err instanceof MongoServerError) {
      buildResp.status = 409;
      buildResp.data.errorType = err.name;
      buildResp.data.errorMessage = err.message;
    }
    else if (err instanceof Error) {
      buildResp.status = 400;
      buildResp.data.errorType = err.name;
      buildResp.data.errorMessage = err.message;
    }
  }
}
