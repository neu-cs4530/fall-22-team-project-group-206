import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import Player from '../lib/Player';
import { getLastEmittedEvent, testPuzzle } from '../TestUtils';
import {
  TownEmitter,
  CrosswordPuzzleModel,
  CrosswordPuzzleArea as CrosswordPuzzleAreaModel,
} from '../types/CoveyTownSocket';
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

  const leaderboard = [
    {
      teamName: 'team1',
      date: '1011',
      score: 10,
      teamMembers: ['user1', 'user2'],
      usedHint: true,
      completed: false,
    },
  ];
  const testDate = new Date('Nov 26, 2022 15:37:25').getTime();
  beforeEach(() => {
    mockClear(townEmitter);
    testArea = new CrosswordPuzzleArea(
      {
        groupName,
        id,
        occupantsByID: [],
        puzzle,
        leaderboard,
        isGameOver: false,
        startTime: testDate,
      },
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
        isGameOver: false,
        startTime: testDate,
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
        isGameOver: false,
        startTime: testDate,
      });
    });
    it("Clears the player's puzzleLabel and emits an update for their location", () => {
      testArea.remove(newPlayer);
      expect(newPlayer.location.interactableID).toBeUndefined();
      const lastEmittedMovement = getLastEmittedEvent(townEmitter, 'playerMoved');
      expect(lastEmittedMovement.location.interactableID).toBeUndefined();
    });
    it('Clears group name and resets the puzzle of the puzzle area when the last occupant leaves', () => {
      const setPuzzleMock = jest.spyOn(
        // Mocking a private method by creating a prototype as seen in
        // https://stackoverflow.com/questions/43265944/is-there-any-way-to-mock-private-functions-with-jest
        // eslint-disable-next-line
        CrosswordPuzzleArea.prototype as any,
        '_setPuzzleModel',
      );
      // Sets puzzle in impl
      // eslint-disable-next-line
      setPuzzleMock.mockImplementation(() => (testArea.puzzle = testPuzzle));

      testArea.remove(newPlayer);
      const lastEmittedUpdate = getLastEmittedEvent(townEmitter, 'interactableUpdate');
      expect(lastEmittedUpdate).toEqual({
        groupName: undefined,
        puzzle: testPuzzle,
        id,
        occupantsByID: [],
        leaderboard,
        isGameOver: false,
      });
      expect(testArea.groupName).toBeUndefined();
    });
  });
  describe('updateModel', () => {
    it('sets the groupName, puzzle, leaderboard and isGameOver and sets no other properties', () => {
      const model: CrosswordPuzzleAreaModel = {
        id: nanoid(),
        groupName: 'some new group name',
        puzzle: testPuzzle,
        leaderboard: [],
        occupantsByID: [],
        isGameOver: true,
      };

      testArea.updateModel(model);

      expect(testArea.groupName).toEqual(model.groupName);
      expect(testArea.puzzle).toEqual(model.puzzle);
      expect(testArea.leaderboard).toEqual(model.leaderboard);
      expect(testArea.isGameOver).toEqual(model.isGameOver);
    });
    it('gets puzzle from API if new puzzle is undefined', () => {
      const setPuzzleMock = jest.spyOn(
        // Mocking a private method by creating a prototype as seen in
        // https://stackoverflow.com/questions/43265944/is-there-any-way-to-mock-private-functions-with-jest
        // eslint-disable-next-line
        CrosswordPuzzleArea.prototype as any,
        '_setPuzzleModel',
      );
      // Sets puzzle in impl
      // eslint-disable-next-line
      setPuzzleMock.mockImplementation(() => (testArea.puzzle = testPuzzle));

      const undefinedPuzzleModel: CrosswordPuzzleAreaModel = {
        id: testArea.id,
        groupName: testArea.groupName,
        puzzle: undefined,
        leaderboard: testArea.leaderboard,
        occupantsByID: testArea.occupantsByID,
        isGameOver: testArea.isGameOver,
      };

      testArea.updateModel(undefinedPuzzleModel);
      expect(setPuzzleMock).toHaveBeenCalled();
      expect(testArea.puzzle).toEqual(testPuzzle);
    });
  });
  describe('toModel', () => {
    it('gets the ID, groupName, puzzle and occupantsByID, leaderboard, isGameOver and gets no other properties', () => {
      const model = testArea.toModel();
      expect(model).toEqual({
        id,
        groupName,
        puzzle,
        occupantsByID: [newPlayer.id],
        leaderboard,
        isGameOver: false,
        startTime: testDate,
      });
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
      isGameOver: false,
      startTime: testDate,
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
      expect(val.startTime).toBeUndefined();
    });
  });
});
