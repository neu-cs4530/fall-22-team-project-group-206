import { MongoClient } from 'mongodb';
import mongoose, { model } from 'mongoose';
import Score from './ScoreModel';
import { IScore } from './IScore';

const collection = 'coveyCrosswordLeaderboard';

export async function addScore(newScore: mongoose.Model<IScore>): Promise<Boolean> {
      new Score(newScore).save((err: any, ) => {
        if (err) {
          console.log(err);
          return false;
        } else {
          console.log(newScore);
          return true;
        }
      });
    return false;
  }

export async function removeScore(teamName:String): Promise<Boolean> {
    Score.deleteOne({ _id: teamName }, (err: any) => {
      if (err) {
        console.log(err);
        return false;
      }
      else {
        return true;
      }
    });
    return true;
  }

export async function findScore(teamName: String): Promise<any> {
    Score.findById({id: score.teamName}, (err: any, score: any) => {
      if(err) {
        console.log(err);
      }
      else {
        console.log(score)
        return score
      }
    });

  }

export async function updateScore(newScore: IScore): Promise<Boolean> {
    Score.findByIdAndUpdate(newScore.teamName, newScore, (err: any, score: any) => {
      if (err) {
        console.log(err);
        return score;
      } else {
        console.log("Successfully updated score!");
        return score;
      }
    }
  );
  return {};
}
}
