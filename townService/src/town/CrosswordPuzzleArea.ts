import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import axios from 'axios';
import Player from '../lib/Player';
import {
  BoundingBox,
  CrosswordPuzzleArea as CrosswordPuzzleAreaModel,
  TownEmitter,
  CrosswordPuzzleModel,
  ScoreModel,
  CrosswordPuzzleCell,
  CellIndex,
  CrosswordExternalModel,
} from '../types/CoveyTownSocket';
import InteractableArea from './InteractableArea';

const CROSSWORDPUZZLE_EXTERNAL_LINK =
  'https://api.foracross.com/api/puzzle_list?page=0&pageSize=1&filter%5BnameOrTitleFilter%5D=Will%20Shortz&filter%5BsizeFilter%5D%5BMini%5D=false&filter%5BsizeFilter%5D%5BStandard%5D=true';

export default class CrosswordPuzzleArea extends InteractableArea {
  /* The name of the group, undefined if no one is in the area */
  public groupName?: string;

  public puzzle?: CrosswordPuzzleModel;

  public leaderboard?: ScoreModel[];

  public isGameOver: boolean;

  public startTime?: number;

  /** The puzzle area is "active" when there are players inside of it  */
  public get isActive(): boolean {
    return this._occupants.length > 0;
  }

  /**
   * Creates a new PuzzleArea
   *
   * @param CrosswordPuzzleModel model containing this area's current group name and its ID
   * @param coordinates  the bounding box that defines this conversation area
   * @param townEmitter a broadcast emitter that can be used to emit updates to players
   */
  public constructor(
    { id, groupName, puzzle, leaderboard, isGameOver, startTime }: CrosswordPuzzleAreaModel,
    coordinates: BoundingBox,
    townEmitter: TownEmitter,
  ) {
    super(id, coordinates, townEmitter);
    this.groupName = groupName;
    if (!puzzle) {
      this._setPuzzleModel();
    } else {
      this.puzzle = puzzle;
    }
    this.leaderboard = leaderboard;
    this.isGameOver = isGameOver;
    this.startTime = startTime;
  }

  /**
   * Removes a player from this puzzle area.
   *
   * Extends the base behavior of InteractableArea to set the puzzle of this PuzzleArea to undefined and
   * emit an update to other players in the town when the last player leaves.
   *
   * @param player
   */
  public remove(player: Player) {
    super.remove(player);
    if (this._occupants.length === 0) {
      this.groupName = undefined;
      this.puzzle = undefined;
      this.startTime = undefined;
      this._setPuzzleModel();
      this._emitAreaChanged();
    }
  }

  /**
   * Updates the state of this CrosswordPuzzleArea, setting the groupName, puzzle, leaderboard and isGameOver properties
   *
   * @param CrosswordPuzzleAreaModel updated model
   */
  public updateModel({
    groupName,
    puzzle,
    leaderboard,
    isGameOver,
    startTime,
  }: CrosswordPuzzleAreaModel) {
    if (!puzzle) {
      this._setPuzzleModel();
    } else {
      this.puzzle = puzzle;
    }
    this.groupName = groupName;
    this.leaderboard = leaderboard;
    this.isGameOver = isGameOver;
    this.startTime = startTime;
  }

  /**
   * Convert this CrosswordPuzzleArea instance to a simple CrosswordPuzzleAreaModel suitable for
   * transporting over a socket to a client.
   */
  public toModel(): CrosswordPuzzleAreaModel {
    return {
      id: this.id,
      occupantsByID: this.occupantsByID,
      groupName: this.groupName,
      puzzle: this.puzzle,
      leaderboard: this.leaderboard,
      isGameOver: this.isGameOver,
      startTime: this.startTime,
    };
  }

  /**
   * Creates a new PuzzleArea object that will represent a Puzzle Area object in the town map.
   * @param mapObject An ITiledMapObject that represents a rectangle in which this puzzle area exists
   * @param broadcastEmitter An emitter that can be used by this puzzle area to broadcast updates
   * @returns
   */
  public static fromMapObject(
    mapObject: ITiledMapObject,
    broadcastEmitter: TownEmitter,
  ): CrosswordPuzzleArea {
    const { name, width, height } = mapObject;
    if (!width || !height) {
      throw new Error(`Malformed viewing area ${name}`);
    }
    const rect: BoundingBox = { x: mapObject.x, y: mapObject.y, width, height };
    return new CrosswordPuzzleArea(
      { id: name, occupantsByID: [], isGameOver: false },
      rect,
      broadcastEmitter,
    );
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
        const cellGrid: CrosswordPuzzleCell[][] = CrosswordPuzzleArea._initializeFromGridToCell(
          rawPuzzleModel.grid,
          rawPuzzleModel.shades,
          rawPuzzleModel.circles,
        );

        this.puzzle = {
          grid: cellGrid,
          info: rawPuzzleModel.info,
          clues: rawPuzzleModel.clues,
        };
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
  private static _initializeFromGridToCell(
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
            CrosswordPuzzleArea._fromPositionToIndex({ row, col }, grid[row].length),
          ),
          isShaded: shadedCells.includes(
            CrosswordPuzzleArea._fromPositionToIndex({ row, col }, grid[row].length),
          ),
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
  private static _fromPositionToIndex({ row, col }: CellIndex, rowSize: number): number {
    return row * rowSize + col;
  }
}
