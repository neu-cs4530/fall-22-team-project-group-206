export class NotFoundError extends Error {
    constructor(message:string){
    super(message);
    this.name = "NotFoundError"
    }
}

export class UndefinedError extends Error {
    constructor(message:string){
    super(message);
    this.name = "UndefinedError"
    }
}

