
export type TownJoinResponse = {
  /** Unique ID that represents this player * */
  userID: string;
  /** Secret token that this player should use to authenticate
   * in future requests to this service * */
  sessionToken: string;
  /** Secret token that this player should use to authenticate
   * in future requests to the video service * */
  providerVideoToken: string;
  /** List of players currently in this town * */
  currentPlayers: Player[];
  /** Friendly name of this town * */
  friendlyName: string;
  /** Is this a private town? * */
  isPubliclyListed: boolean;
  /** Current state of interactables in this town */
  interactables: Interactable[];
}

export type Interactable = ViewingArea | ConversationArea | CrosswordPuzzleArea;

export type TownSettingsUpdate = {
  friendlyName?: string;
  isPubliclyListed?: boolean;
}

export type Direction = 'front' | 'back' | 'left' | 'right';
export interface Player {
  id: string;
  userName: string;
  location: PlayerLocation;
};

export type XY = { x: number, y: number };

export interface PlayerLocation {
  /* The CENTER x coordinate of this player's location */
  x: number;
  /* The CENTER y coordinate of this player's location */
  y: number;
  /** @enum {string} */
  rotation: Direction;
  moving: boolean;
  interactableID?: string;
};
export type ChatMessage = {
  author: string;
  sid: string;
  body: string;
  dateCreated: Date;
};

export interface ConversationArea {
  id: string;
  topic?: string;
  occupantsByID: string[];
};

//CrosswordPuzzleArea model to represent a crosswordPuzzle area
export interface CrosswordPuzzleArea {
  id: string;
  groupName?: string;
  puzzle?: CrosswordPuzzleModel;
  occupantsByID: string[];
  leaderboard?: Leaderboard;
  isGameOver: boolean;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface ViewingArea {
  id: string;
  video?: string;
  isPlaying: boolean;
  elapsedTimeSec: number;
}

//The model to represent crosswordPuzzle response get from external api
export interface CrosswordExternalModel {
  grid: string[][];
  info: CrosswordPuzzleInfo;
  clues: CrosswordPuzzleClues;
  shades: number[];
  circles: number[];
}

//The model used to fit in CrosswordPuzzleArea
export interface CrosswordPuzzleModel {
  grid: CrosswordPuzzleCell[][];
  info: CrosswordPuzzleInfo;
  clues: CrosswordPuzzleClues;

}

//represent a single cell in the CrosswordPuzzle grid
export interface CrosswordPuzzleCell {
  isCircled: boolean; // if the cell is circled
  isShaded: boolean; // if the cell is shaded
  value: string; // the current input from user
  solution: string; // the corrent solution for this cell
}

//Info type in CrosswordPuzzleModel
export interface CrosswordPuzzleInfo {
  type: string;
  title: string;
  author: string;
  description: string;
}

//clue type in CrosswordPuzzleModel
export interface CrosswordPuzzleClues {
  down: string[];
  across: string[];
}

//crossword Puzzle's position representation
export interface CrosswordPosition {
  row: number; //row index
  col: number; // col index
}

//leaderboard representation
export interface Leaderboard {
  teamName: string;
  date: string;
  score: number;
  users: string[];
  usedHint:boolean;
  completePercentage:number;

}

export interface ServerToClientEvents {
  playerMoved: (movedPlayer: Player) => void;
  playerDisconnect: (disconnectedPlayer: Player) => void;
  playerJoined: (newPlayer: Player) => void;
  initialize: (initialData: TownJoinResponse) => void;
  townSettingsUpdated: (update: TownSettingsUpdate) => void;
  townClosing: () => void;
  chatMessage: (message: ChatMessage) => void;
  interactableUpdate: (interactable: Interactable) => void;
}

export interface ClientToServerEvents {
  chatMessage: (message: ChatMessage) => void;
  playerMovement: (movementData: PlayerLocation) => void;
  interactableUpdate: (update: Interactable) => void;
}