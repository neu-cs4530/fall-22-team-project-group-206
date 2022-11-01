import { IScore } from "./db/IScore"


export interface scoreCreateResponse {
    success: boolean,
    score?: IScore,
    error?: Error
}

export interface scoreDeleteResponse {
    success: boolean,
    error?: Error
}
