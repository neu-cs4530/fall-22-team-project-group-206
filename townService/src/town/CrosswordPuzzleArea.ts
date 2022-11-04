import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import axios from 'axios';
import Player from '../lib/Player';
import {
  BoundingBox,
  CrosswordPuzzleArea as CrosswordPuzzleAreaModel,
  TownEmitter,
  CrosswordPuzzleModel,
  CrosswordPosition,
  CrosswordPuzzleCell,
  CrosswordExternalModel,
} from '../types/CoveyTownSocket';
import CrosswordPuzzleService from './CrosswordPuzzleService';
import InteractableArea from './InteractableArea';

export default class CrosswordPuzzleArea extends InteractableArea {
  /* The name of the group, undefined if no one is in the area */
  public groupName?: string;

  public puzzle?: CrosswordPuzzleModel;

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
    { id, groupName, puzzle }: CrosswordPuzzleAreaModel,
    coordinates: BoundingBox,
    townEmitter: TownEmitter,
  ) {
    super(id, coordinates, townEmitter);
    this.groupName = groupName;
    this.puzzle = puzzle;
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
      this._emitAreaChanged();
    }
  }

  /**
   * Convert this PuzzleArea instance to a simple PuzzleAreaModel suitable for
   * transporting over a socket to a client.
   */
  public toModel(): CrosswordPuzzleAreaModel {
    return {
      id: this.id,
      occupantsByID: this.occupantsByID,
      groupName: this.groupName,
      puzzle: this.puzzle,
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
    return new CrosswordPuzzleArea({ id: name, occupantsByID: [] }, rect, broadcastEmitter);
  }

  /**
   * Method that sets daily puzzle to the CrosswordPuzzleArea
   *
   */
  public async setPuzzleModel(): Promise<void> {
    try {
      await axios.get(CrosswordPuzzleService.CROSSWORDPUZZLE_EXTERNAL_LINK).then(response => {
        const rawPuzzleModel: CrosswordExternalModel = response.data.puzzle[0]
          .content as CrosswordExternalModel;
        this.puzzle = {
          grid: CrosswordPuzzleArea.initializeFromGridToCell(
            rawPuzzleModel.grid,
            rawPuzzleModel.shades,
            rawPuzzleModel.circle,
          ),
          info: rawPuzzleModel.info,
          clues: rawPuzzleModel.clues,
        };
      });
    } catch (err) {
      throw new Error('Error when fetching the puzzle');
    }
  }

  /**
   * Helper method that convert raw data from thrid party api to gird in CrosswordPuzzleModel
   * @param gird gird from thrid party api
   * @param shades tiles that is shaded
   * @param circle tiles that is circled
   * @returns 2D list of CrosswordPuzzleCell which is used for constructing CrosswordPuzzleModel
   */
  public static initializeFromGridToCell(
    grid: string[][],
    shades: number[],
    circle: number[],
  ): CrosswordPuzzleCell[][] {
    const cells: CrosswordPuzzleCell[][] = [];
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        const currentCell: CrosswordPuzzleCell = {
          value: '',
          solution: grid[row][col],
          isCircle: CrosswordPuzzleArea.fromPositionToIndex({ row, col }, grid[0].length) in circle,
          isShades: CrosswordPuzzleArea.fromPositionToIndex({ row, col }, grid[0].length) in shades,
        };
        cells[row][col] = currentCell;
      }
    }
    return cells;
  }

  /**
   * Helper methods that takes in position number and return the index array which is represented by [rowIndex, colIndex]
   * @param row row index of the tile
   * @param col column index of the tile
   * @param rowSize length of the gird namly column size of the grid
   * @param height height of the grid namly row size of the gird
   * @returns number converted from a CrosswordPositioon
   */
  public static fromPositionToIndex({ row, col }: CrosswordPosition, rowSize: number): number {
    return row * rowSize + col + 1;
  }
}
