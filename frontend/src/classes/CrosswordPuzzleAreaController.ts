import EventEmitter from 'events';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import TypedEmitter from 'typed-emitter';
import {
  CrosswordPuzzleArea as CrosswordPuzzleAreaModel,
  CrosswordPuzzleModel,
  ScoreModel,
} from '../types/CoveyTownSocket';
import PlayerController from './PlayerController';

/**
 * The events that the CrosswordPuzzleAreaController emits to subscribers. These events
 * are only ever emitted to local components (not to the townService).
 */
export type CrosswordPuzzleAreaEvents = {
  puzzleChange: (newPuzzle: CrosswordPuzzleModel | undefined) => void;
  occupantsChange: (newOccupants: PlayerController[]) => void;
  gameOverChange: (newIsGameOver: boolean) => void;
  groupNameChange: (newGroupName: string | undefined) => void;
  startTimeChange: (newStartTime: number | undefined) => void;
};

/**
 * A CrosswordPuzzleAreaController manages the local behavior of a crossword puzzle area in the frontend,
 * implementing the logic to bridge between the townService's interpretation of crossword puzzle areas and the
 * frontend's. The CrosswordPuzzleAreaController emits events when the convecrossword puzzlersation area changes.
 */
export default class CrosswordPuzzleAreaController extends (EventEmitter as new () => TypedEmitter<CrosswordPuzzleAreaEvents>) {
  private _occupants: PlayerController[] = [];

  private _id: string;

  private _puzzle?: CrosswordPuzzleModel;

  private _leaderboard?: ScoreModel[];

  private _isGameOver: boolean;

  private _startTime?: number;

  private _groupName?: string;

  /**
   * Create a new CrosswordPuzzleAreaController;
   * @param id
   * @param isGameOver
   * @param puzzle
   * @param leaderboard
   */
  constructor(
    id: string,
    isGameOver: boolean,
    puzzle?: CrosswordPuzzleModel,
    leaderboard?: ScoreModel[],
    startTime?: number,
    groupName?: string,
  ) {
    super();
    this._id = id;
    this._puzzle = puzzle;
    this._leaderboard = leaderboard;
    this._isGameOver = isGameOver;
    this._startTime = startTime;
    this._groupName = groupName;
  }

  /**
   * The ID of this crossword puzzle area (read only)
   */
  get id() {
    return this._id;
  }

  /**
   * The list of occupants in this crossword puzzle area. Changing the set of occupants
   * will emit an occupantsChange event.
   */
  set occupants(newOccupants: PlayerController[]) {
    if (
      newOccupants.length !== this._occupants.length ||
      _.xor(newOccupants, this._occupants).length > 0
    ) {
      this.emit('occupantsChange', newOccupants);
      this._occupants = newOccupants;
    }
  }

  get occupants() {
    return this._occupants;
  }

  /**
   * The puzzle in this crossword puzzle area. Changing the puzzle
   * will emit an puzzleChange event.
   */
  set puzzle(newPuzzle: CrosswordPuzzleModel | undefined) {
    if (this._puzzle !== newPuzzle) {
      this.emit('puzzleChange', newPuzzle);
      if (newPuzzle) {
        this._puzzle = newPuzzle;
      } else {
        this.isGameOver = false;
      }
    }
  }

  get puzzle(): CrosswordPuzzleModel | undefined {
    return this._puzzle;
  }

  /**
   * The leaderboard in this crossword puzzle area. Changing the leaderboard
   * will emit an puzzleChange event.
   */
  set leaderboard(newLeaderboard: ScoreModel[] | undefined) {
    // TODO – this might be deleted (Frank)
    this._leaderboard = newLeaderboard;
  }

  get leaderboard(): ScoreModel[] | undefined {
    return this._leaderboard;
  }

  /**
   * The isGameOver in this crossword puzzle area. Changing the isGameOver
   * will emit an gameOverChange event.
   */
  set isGameOver(isGameOver: boolean) {
    if (isGameOver !== this.isGameOver) {
      this._isGameOver = isGameOver;
      this.emit('gameOverChange', isGameOver);
    }
  }

  get isGameOver(): boolean {
    return this._isGameOver;
  }

  /**
   * The puzzle in this crossword puzzle area. Changing the start time
   * will emit an puzzleChange event.
   */
  set startTime(startTime: number | undefined) {
    if (startTime !== this._startTime) {
      this._startTime = startTime;
      this.emit('startTimeChange', startTime);
    }
  }

  get startTime(): number | undefined {
    return this._startTime;
  }

  /**
   * The groupName in this crossword puzzle area. Changing the group name
   * will emit an groupNameChange event.
   */
  set groupName(groupName: string | undefined) {
    if (groupName !== this._groupName) {
      this._groupName = groupName;
      this.emit('groupNameChange', groupName);
    }
  }

  get groupName(): string | undefined {
    return this._groupName;
  }

  /**
   * A crossword puzzle area is empty if there are no occupants in it.
   */
  public isEmpty(): boolean {
    return this._occupants.length === 0;
  }

  /**
   * Return a representation of this CrosswordPuzzleAreaController that matches the
   * townService's representation and is suitable for transmitting over the network.
   */
  public toCrosswordPuzzleAreaModel(): CrosswordPuzzleAreaModel {
    return {
      id: this.id,
      occupantsByID: this.occupants.map(player => player.id),
      puzzle: this.puzzle,
      leaderboard: this.leaderboard,
      isGameOver: this.isGameOver,
      groupName: this.groupName,
      startTime: this.startTime,
    };
  }

  public updateFrom(
    newCrosswordPuzzleAreaModel: CrosswordPuzzleAreaModel,
    playerFinder: (playerIDs: string[]) => PlayerController[],
  ): void {
    this.puzzle = newCrosswordPuzzleAreaModel.puzzle;
    this.leaderboard = newCrosswordPuzzleAreaModel.leaderboard;
    this.isGameOver = newCrosswordPuzzleAreaModel.isGameOver;
    this.occupants = playerFinder(newCrosswordPuzzleAreaModel.occupantsByID);
    this.groupName = newCrosswordPuzzleAreaModel.groupName;
  }

  /**
   * Create a new CrosswordPuzzleAreaController to match a given CrosswordPuzzleAreaModel
   * @param xwPuzzleAreaModel Crossword puzzle area to represent
   * @param playerFinder A function that will return a list of PlayerController's
   *                     matching a list of Player ID's
   */
  public static fromCrosswordPuzzleAreaModel(
    crosswordPuzzleAreaModel: CrosswordPuzzleAreaModel,
    playerFinder: (playerIDs: string[]) => PlayerController[],
  ): CrosswordPuzzleAreaController {
    const ret = new CrosswordPuzzleAreaController(
      crosswordPuzzleAreaModel.id,
      crosswordPuzzleAreaModel.isGameOver,
      crosswordPuzzleAreaModel.puzzle,
      crosswordPuzzleAreaModel.leaderboard,
      crosswordPuzzleAreaModel.startTime,
      crosswordPuzzleAreaModel.groupName,
    );
    ret.occupants = playerFinder(crosswordPuzzleAreaModel.occupantsByID);
    return ret;
  }
}

/**
 * A react hook to retrieve the occupants of a CrosswordPuzzleAreaController, returning an array of PlayerController.
 *
 * This hook will re-render any components that use it when the set of occupants changes.
 */
export function useCrosswordPuzzleAreaOccupants(
  area: CrosswordPuzzleAreaController,
): PlayerController[] {
  const [occupants, setOccupants] = useState(area.occupants);
  useEffect(() => {
    area.addListener('occupantsChange', setOccupants);
    return () => {
      area.removeListener('occupantsChange', setOccupants);
    };
  }, [area]);
  return occupants;
}
