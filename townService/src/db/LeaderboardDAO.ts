import Score from './ScoreModel';
import { IScore } from './IScore';
import { scoreCreateResponse, scoreDeleteResponse } from '../types';
import { resolvePtr } from 'dns';

export async function addScore(newScore: IScore): Promise<scoreCreateResponse> {
  var resp: scoreCreateResponse = { status: 200 };
  try {
    var creation = await Score.create(newScore);
    resp.score = creation ;
  } catch (e) {
    if (e instanceof Error) {
      resp = { status: 400, error: e };
    }
  }
  return resp;
}

export async function removeScore(teamName: String): Promise<scoreDeleteResponse> {
  var resp: scoreCreateResponse = { status: 200 };
  try {
    await Score.deleteOne({ _id: teamName });
  } catch (e) {
    if (e instanceof Error) {
      resp.status = 404;
      resp.error = e;
    }
  }
  return resp;
}

export async function findScore(teamName: String): Promise<scoreCreateResponse> {
  var resp: scoreCreateResponse = { status: 200 };
  try {
    var scoreFound = await Score.findById({ id: teamName });
    if (scoreFound !== undefined && scoreFound !== null) {
      resp.score = scoreFound;
    }
    else {
      resp.status = 404;
    }
  }
  catch (e) {
    if (e instanceof Error) {
      resp.status = 404;
      resp.error = e;
    }
  }
  return resp
  
}

export async function updateScore(newScore: IScore): Promise<scoreCreateResponse> {
  var resp :scoreCreateResponse = {status: 0}
  try {
  var updatedScore = await Score.findByIdAndUpdate(newScore.teamName, newScore);
  if (updatedScore) {
    resp.status = 200
    resp.score = updatedScore
  }
  else {
    resp.status = 404
  }
  }
  catch (e) {
    if (e instanceof Error) {
      resp.status = 404
      resp.error = e
    }
  }
  return resp
}

export async function getScores(): Promise<scoreCreateResponse> {
  var resp: scoreCreateResponse = {status: 0}
  try {
    var scores: IScore[] = await Score.find()
    resp.status = 200
  }
  catch (e){
    if (e instanceof Error) {
      resp.status = 404
      resp.error = e
    }
  }
  return resp
}
