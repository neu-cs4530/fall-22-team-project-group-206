import Score from './ScoreModel';
import { IScore } from './IScore';
import { scoreCreateResponse, scoreDeleteResponse } from '../types';

export async function addScore(newScore: IScore): Promise<scoreCreateResponse> {
  var resp: scoreCreateResponse = { success: false };
  try {
    var creation = await Score.create(newScore);
    resp = { success: true, score: creation };
  } catch (e) {
    if (e instanceof Error) {
      resp = { success: false, error: e };
    }
  }
  return resp;
}

export async function removeScore(teamName: String): Promise<scoreDeleteResponse> {
  
  try {
    await Score.deleteOne({ _id: teamName });
    return {success: true}
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e };
    }
  }
  return {success: false};
}

export async function findScore(teamName: String): Promise<scoreCreateResponse> {
  try {
    var creation = await Score.findById({ id: teamName });
    if (creation) {
      return {success:true, score: creation}
    }
    else {
      return {success: false, error: new Error('Score not found')}
    }
  }
  catch (e) {
    if (e instanceof Error) {
      return {success: false, error: e}
    }
  }
  return {success: false}
  
}

export async function updateScore(newScore: IScore): Promise<scoreCreateResponse> {
  try {
  var creation = await Score.findByIdAndUpdate(newScore.teamName, newScore);
  if (creation) {
    return {success: true, score: creation}
  }
  else {
    return {success: false, error: new Error('Score not found')}
  }
  }
  catch (e) {
    if (e instanceof Error) {
      return {success: false, error: e}
    }
  }
  return {success: false}
}
