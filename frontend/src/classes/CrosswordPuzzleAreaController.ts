import axios from 'axios';
import EventEmitter from 'events';
import _ from 'lodash';
import TypedEmitter from 'typed-emitter';
import { useEffect, useState } from 'react';
import {
  CrosswordExternalModel,
  CrosswordPosition,
  CrosswordPuzzleArea as CrosswordPuzzleAreaModel,
  CrosswordPuzzleCell,
  CrosswordPuzzleModel,
  ScoreModel,
} from '../types/CoveyTownSocket';
import PlayerController from './PlayerController';

const CROSSWORDPUZZLE_EXTERNAL_LINK =
  'https://api.foracross.com/api/puzzle_list?page=0&pageSize=1&filter%5BnameOrTitleFilter%5D=Will%20Shortz&filter%5BsizeFilter%5D%5BMini%5D=false&filter%5BsizeFilter%5D%5BStandard%5D=true';

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
 * A CrosswordPuzzleAreaController manages the local behavior of a conversation area in the frontend,
 * implementing the logic to bridge between the townService's interpretation of conversation areas and the
 * frontend's. The CrosswordPuzzleAreaController emits events when the conversation area changes.
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
    if (!puzzle) {
      this._setPuzzleModel();
    }
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
        this._setPuzzleModel();
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
    throw Error('Not implemented yet.');
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

  /**
   * Method that sets daily puzzle to the CrosswordPuzzleArea
   * @param externalLink the external api that is applied here to fetch puzzle
   */
  private async _setPuzzleModel(): Promise<void> {
    await axios.get(CROSSWORDPUZZLE_EXTERNAL_LINK).then(response => {
      try {
        if (!response.data.puzzles[0].content) {
          throw new Error('puzzle not fetched');
        }
        const rawPuzzleModel: CrosswordExternalModel = response.data.puzzles[0]
          .content as CrosswordExternalModel;
        const cellGrid: CrosswordPuzzleCell[][] = this._initializeFromGridToCell(
          rawPuzzleModel.grid,
          rawPuzzleModel.shades,
          rawPuzzleModel.circles,
        );
        this.puzzle = {
          grid: cellGrid,
          info: rawPuzzleModel.info,
          clues: rawPuzzleModel.clues,
        };
        this.startTime = Date.now();
      } catch (err) {
        throw new Error('There was an error when trying to fetch');
      }
    });
  }

  /**
   * Helper method that convert raw data from thrid party api to gird in CrosswordPuzzleModel
   * @param grid gird from thrid party api
   * @param shadedCells tiles that is shaded
   * @param circledCells tiles that is circled
   * @returns 2D list of CrosswordPuzzleCell which is used for constructing CrosswordPuzzleModel
   */
  private _initializeFromGridToCell(
    grid: string[][],
    shadedCells: number[],
    circledCells: number[],
  ): CrosswordPuzzleCell[][] {
    const cells: CrosswordPuzzleCell[][] = [];
    for (let row = 0; row < grid.length; row++) {
      cells.push([]);
      for (let col = 0; col < grid[0].length; col++) {
        const currentCell: CrosswordPuzzleCell = {
          value: '',
          solution: grid[row][col],
          isCircled: circledCells.includes(
            this._fromPositionToIndex({ row, col }, grid[row].length),
          ),
          isShaded: shadedCells.includes(this._fromPositionToIndex({ row, col }, grid[row].length)),
          usedHint: false,
        };
        cells[row].push(currentCell);
      }
    }
    return cells;
  }

  /**
   * Helper methods that takes in position number and return the index array which is represented by [rowIndex, colIndex]
   * @param row row index of the tile
   * @param col column index of the tile
   * @param rowSize length of the gird namly column size of the grid
   * @returns number converted from a CrosswordPositioon
   */
  private _fromPositionToIndex({ row, col }: CrosswordPosition, rowSize: number): number {
    return row * rowSize + col;
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
