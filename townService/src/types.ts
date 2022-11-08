import { IScore } from './db/IScore';

export interface ScoreCreateResponse {
  status: number;
  score?: IScore;
  error?: Error;
}

export interface ScoreDeleteResponse {
  status: number;
  error?: Error;
}

export interface ScoreFindResponse {
  status: number;
  scores?: IScore[];
  error?: Error;
}
