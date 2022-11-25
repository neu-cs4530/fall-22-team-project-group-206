import { ScoreModel } from '../types/CoveyTownSocket';

export interface ScoreCreateResponse {
  status: number;
  score?: ScoreModel;
  error?: Error;
}

export interface ScoreDeleteResponse {
  status: number;
  error?: Error;
}

export interface ScoreFindResponse {
  status: number;
  scores?: ScoreModel[];
  error?: Error;
}
