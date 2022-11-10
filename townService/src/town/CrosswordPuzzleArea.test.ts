import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import Player from '../lib/Player';
import { getLastEmittedEvent } from '../TestUtils';
import { TownEmitter, CrosswordPuzzleModel, CrosswordPuzzleCell } from '../types/CoveyTownSocket';
import CrosswordPuzzleArea from './CrosswordPuzzleArea';

describe('PuzzleArea', () => {
  const testAreaBox = { x: 100, y: 100, width: 100, height: 100 };
  let testArea: CrosswordPuzzleArea;
  const townEmitter = mock<TownEmitter>();
  const groupName = nanoid();
  const puzzle: CrosswordPuzzleModel = {
    grid: [],
    info: {
      type: 'Daily Puzzle',
      title: 'NY Times, Monday, October 24, 2022',
      author: 'Joe Rodini / Will Shortz',
      description: '',
    },
    clues: {
      down: [],
      across: [],
    },
  };
  const id = nanoid();
  let newPlayer: Player;
  const grid: string[][] = [
    ['1', '2'],
    ['3', '4'],
  ];
  const cell1: CrosswordPuzzleCell = {
    value: '',
    solution: '1',
    isCircled: true,
    isShaded: false,
  };
  const cell2: CrosswordPuzzleCell = {
    value: '',
    solution: '2',
    isCircled: false,
    isShaded: true,
  };
  const cell3: CrosswordPuzzleCell = {
    value: '',
    solution: '3',
    isCircled: false,
    isShaded: false,
  };
  const cell4: CrosswordPuzzleCell = {
    value: '',
    solution: '4',
    isCircled: false,
    isShaded: false,
  };

  const cellGrid: CrosswordPuzzleCell[][] = [
    [cell1, cell2],
    [cell3, cell4],
  ];

  const leaderboard = {
    teamName: 'team1',
    date: '1011',
    score: 10,
    users: ['user1', 'user2'],
    usedHint: true,
    completePercentage: 90,
  };
  beforeEach(() => {
    mockClear(townEmitter);
    testArea = new CrosswordPuzzleArea(
<<<<<<< HEAD
      { groupName, id, occupantsByID: [], puzzle, leaderboard },
=======
      { groupName, id, occupantsByID: [], puzzle, leaderboard, isGameOver: false },
>>>>>>> main
      testAreaBox,
      townEmitter,
    );
    newPlayer = new Player(nanoid(), mock<TownEmitter>());
    testArea.add(newPlayer);
  });
  describe('add', () => {
    it('Adds the player to the occupants list and emits an interactableUpdate event', () => {
      expect(testArea.occupantsByID).toEqual([newPlayer.id]);

      const lastEmittedUpdate = getLastEmittedEvent(townEmitter, 'interactableUpdate');
      expect(lastEmittedUpdate).toEqual({
        groupName,
        id,
        occupantsByID: [newPlayer.id],
        puzzle,
        leaderboard,
<<<<<<< HEAD
=======
        isGameOver: false,
>>>>>>> main
      });
    });
    it("Sets the player's PuzzleLabel and emits an update for their location", () => {
      expect(newPlayer.location.interactableID).toEqual(id);

      const lastEmittedMovement = getLastEmittedEvent(townEmitter, 'playerMoved');
      expect(lastEmittedMovement.location.interactableID).toEqual(id);
    });
  });
  describe('remove', () => {
    it('Removes the player from the list of occupants and emits an interactableUpdate event', () => {
      // Add another player so that we are not also testing what happens when the last player leaves
      const extraPlayer = new Player(nanoid(), mock<TownEmitter>());
      testArea.add(extraPlayer);
      testArea.remove(newPlayer);

      expect(testArea.occupantsByID).toEqual([extraPlayer.id]);
      const lastEmittedUpdate = getLastEmittedEvent(townEmitter, 'interactableUpdate');
      expect(lastEmittedUpdate).toEqual({
        groupName,
        id,
        occupantsByID: [extraPlayer.id],
        puzzle,
        leaderboard,
<<<<<<< HEAD
=======
        isGameOver: false,
>>>>>>> main
      });
    });
    it("Clears the player's puzzleLabel and emits an update for their location", () => {
      testArea.remove(newPlayer);
      expect(newPlayer.location.interactableID).toBeUndefined();
      const lastEmittedMovement = getLastEmittedEvent(townEmitter, 'playerMoved');
      expect(lastEmittedMovement.location.interactableID).toBeUndefined();
    });
    it('Clears the group name of the puzzle area when the last occupant leaves', () => {
      testArea.remove(newPlayer);
      const lastEmittedUpdate = getLastEmittedEvent(townEmitter, 'interactableUpdate');
      expect(lastEmittedUpdate).toEqual({
        groupName: undefined,
        id,
        occupantsByID: [],
        leaderboard,
<<<<<<< HEAD
=======
        isGameOver: false,
>>>>>>> main
      });
      expect(testArea.groupName).toBeUndefined();
      expect((testArea.leaderboard = leaderboard));
    });
    it('Clears the puzzle of the puzzle area when the last occupant leaves', () => {
      testArea.remove(newPlayer);
      const lastEmittedUpdate = getLastEmittedEvent(townEmitter, 'interactableUpdate');
<<<<<<< HEAD
      expect(lastEmittedUpdate).toEqual({ puzzle: undefined, id, occupantsByID: [], leaderboard });
=======
      expect(lastEmittedUpdate).toEqual({
        puzzle: undefined,
        id,
        occupantsByID: [],
        leaderboard,
        isGameOver: false,
      });
>>>>>>> main
      expect(testArea.puzzle).toBeUndefined();
    });
  });
  test('toModel sets the ID, groupName, puzzle and occupantsByID and sets no other properties', () => {
    const model = testArea.toModel();
    expect(model).toEqual({
      id,
      groupName,
      puzzle,
      occupantsByID: [newPlayer.id],
      leaderboard,
<<<<<<< HEAD
=======
      isGameOver: false,
>>>>>>> main
    });
  });
  describe('fromMapObject', () => {
    it('Throws an error if the width or height are missing', () => {
      expect(() =>
        CrosswordPuzzleArea.fromMapObject(
          { id: 1, name: nanoid(), visible: true, x: 0, y: 0 },
          townEmitter,
        ),
      ).toThrowError();
    });
    it('Creates a new puzzle area using the provided boundingBox and id, with an empty occupants list', () => {
      const x = 30;
      const y = 20;
      const width = 10;
      const height = 20;
      const name = 'name';
      const val = CrosswordPuzzleArea.fromMapObject(
        { x, y, width, height, name, id: 10, visible: true },
        townEmitter,
      );
      expect(val.boundingBox).toEqual({ x, y, width, height });
      expect(val.id).toEqual(name);
      expect(val.groupName).toBeUndefined();
      expect(val.puzzle).toBeUndefined();
      expect(val.occupantsByID).toEqual([]);
    });
  });

  describe('fromMapObject', () => {
    it('Throws an error if the width or height are missing', () => {
      expect(() =>
        CrosswordPuzzleArea.fromMapObject(
          { id: 1, name: nanoid(), visible: true, x: 0, y: 0 },
          townEmitter,
        ),
      ).toThrowError();
    });
    it('Creates a new puzzle area using the provided boundingBox and id, with an empty occupants list', () => {
      const x = 30;
      const y = 20;
      const width = 10;
      const height = 20;
      const name = 'name';
      const val = CrosswordPuzzleArea.fromMapObject(
        { x, y, width, height, name, id: 10, visible: true },
        townEmitter,
      );
      expect(val.boundingBox).toEqual({ x, y, width, height });
      expect(val.id).toEqual(name);
      expect(val.groupName).toBeUndefined();
      expect(val.puzzle).toBeUndefined();
      expect(val.occupantsByID).toEqual([]);
    });
  });
});
