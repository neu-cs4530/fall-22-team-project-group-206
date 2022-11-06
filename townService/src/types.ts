import { IScore } from "./db/IScore"


export interface scoreCreateResponse {
    status: number,
    score?: IScore,
    error?: Error
}

export interface scoreDeleteResponse {
    status: number,
    error?: Error
}
