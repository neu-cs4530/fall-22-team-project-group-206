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
};

export type Interactable = ViewingArea | ConversationArea | CrosswordPuzzleArea;

export type TownSettingsUpdate = {
  friendlyName?: string;
  isPubliclyListed?: boolean;
};

export type Direction = "front" | "back" | "left" | "right";
export interface Player {
  id: string;
  userName: string;
  location: PlayerLocation;
}

export type XY = { x: number; y: number };

export interface PlayerLocation {
  /* The CENTER x coordinate of this player's location */
  x: number;
  /* The CENTER y coordinate of this player's location */
  y: number;
  /** @enum {string} */
  rotation: Direction;
  moving: boolean;
  interactableID?: string;
}
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
}

// CrosswordPuzzleArea model to represent a crosswordPuzzle area
export interface CrosswordPuzzleArea {
  id: string;
  groupName?: string;
  puzzle?: CrosswordPuzzleModel;
  occupantsByID: string[];
  isGameOver: boolean;
  startTime?: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ViewingArea {
  id: string;
  video?: string;
  isPlaying: boolean;
  elapsedTimeSec: number;
}

// The model to represent crosswordPuzzle response get from external api
export interface CrosswordExternalModel {
  grid: string[][];
  info: CrosswordPuzzleInfo;
  clues: CrosswordPuzzleClues;
  shades: number[];
  circles: number[];
}

// The model used to fit in CrosswordPuzzleArea
export interface CrosswordPuzzleModel {
  grid: CrosswordPuzzleCell[][];
  info: CrosswordPuzzleInfo;
  clues: CrosswordPuzzleClues;
}

// represent a single cell in the CrosswordPuzzle grid
export interface CrosswordPuzzleCell {
  isCircled: boolean; // if the cell is circled
  isShaded: boolean; // if the cell is shaded
  value: string; // the current input from user
  solution: string; // the corrent solution for this cell
  usedHint: boolean; // if the cell was checked
}

// Info type in CrosswordPuzzleModel
export interface CrosswordPuzzleInfo {
  type: string;
  title: string;
  author: string;
  description: string;
}

// clue type in CrosswordPuzzleModel
export interface CrosswordPuzzleClues {
  down: (string | null)[];
  across: (string | null)[];
}

// crossword Puzzle's position representation
export interface CellIndex {
  row: number; // row index
  col: number; // col index
}

// score representation
export interface ScoreModel {
  teamName: string;
  score: number;
  teamMembers: string[];
  usedHint: boolean = false;
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

export interface InsertScoreRequestBody {
  // score being inserted into the database
  scoreModel: ScoreModel
}

/**
 * The api response for CRUD operations conducted on scores within the database.
 */
 export interface ScoreModifyResponse {
  status: number;
  data: {
    score?: ScoreModel;
    errorType?: string;
    errorMessage?: string;
  };
}

/**
 * The api response for finding multiple scores within the database (ex. the whole leaderboard).
 */
export interface ScoreFindResponse {
  status: number;
  data: {
    scores?: ScoreModel[];
    errorType?: string;
    errorMessage?: string;
  };
}

/**
 * The api response for seeing if a teamName is currently in use
 */
export interface TeamNameInUseResponse {
  status: number;
  data: {
    inUse?: boolean;
    errorType?: string;
    errorMessage?: string;
  };
}
