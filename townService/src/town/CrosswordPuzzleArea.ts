import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import Player from '../lib/Player';
import {
  BoundingBox,
  CrosswordPuzzleArea as CrosswordPuzzleAreaModel,
  TownEmitter,
  CrosswordPuzzleModel,
} from '../types/CoveyTownSocket';
import InteractableArea from './InteractableArea';

export default class PuzzleArea extends InteractableArea {
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
   * @param PuzzleModel model containing this area's current group name and its ID
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
   * Extends the base behavior of InteractableArea to set the topic of this PuzzleArea to undefined and
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
  ): PuzzleArea {
    const { name, width, height } = mapObject;
    if (!width || !height) {
      throw new Error(`Malformed viewing area ${name}`);
    }
    const rect: BoundingBox = { x: mapObject.x, y: mapObject.y, width, height };
    return new PuzzleArea({ id: name, occupantsByID: [] }, rect, broadcastEmitter);
  }
}
