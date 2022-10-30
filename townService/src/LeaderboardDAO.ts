import { MongoClient } from "mongodb";
import { emit } from "process";
import { assertType } from "typescript-is";
import { Score } from "./Score";


const collection = 'coveyCrosswordLeaderboard'

class leaderboardDAO {

    private _client: MongoClient;


    public constructor(client: MongoClient) {
        this._client = client;
    }


    public async addScore(score: Score) : Promise<Score> {

        const currentCollection = this._client.db().collection(collection);
        try {
            await currentCollection.insertOne(score)
            return score
        }
        catch {
            //maybe emit?
        }
        
    }
    
    
    public async removeScore(teamName: string) {
        const currentCollection = this._client.db().collection(collection);
        try {
            await currentCollection.deleteOne({teamName: teamName})
        }
        catch {
            //maybe emit?
        }
    }
    
    public async findScore(teamName: string) {
        const currentCollection = this._client.db().collection(collection);
        try {
            await currentCollection.findOne({teamName: teamName})
        }
        catch {
            //maybe emit?
        }
    }
    
    public async updateScore(newScore: Score): Promise<Score> {
        const currentCollection = this._client.db().collection(collection);
        try {
            await currentCollection.updateOne((score: Score) => score.teamName == newScore.teamName, newScore);
            return newScore
        }
        catch {
            //maybe emit?
        }
        Error()
    }
    /*
    public async findScores(): Promise<Score[]> {
        const currentCollection = await this._client.db().collection(collection);
        var items : Score[];
        try {
            items =  currentCollection.find().toArray() a
        }
        catch {
            //maybe emit?
        }
        if (items) {
            return items;
        }
        return ;
    }
    */
}

