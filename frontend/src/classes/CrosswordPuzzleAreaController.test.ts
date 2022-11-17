import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { CrosswordPuzzleModel, PlayerLocation } from '../types/CoveyTownSocket';
import CrosswordPuzzleAreaController, {
  CrosswordPuzzleAreaEvents,
} from './CrosswordPuzzleAreaController';
import PlayerController from './PlayerController';

describe('CrosswordPuzzleArea', () => {
  let testArea: CrosswordPuzzleAreaController;
  const mockListeners = mock<CrosswordPuzzleAreaEvents>();
  const testPuzzle: CrosswordPuzzleModel = {
    grid: [
      [
        { value: '', solution: '.', isCircled: false, isShaded: false },
        { value: '', solution: '.', isCircled: false, isShaded: false },
        { value: '', solution: 'M', isCircled: false, isShaded: false },
        { value: '', solution: 'C', isCircled: false, isShaded: false },
        { value: '', solution: 'S', isCircled: false, isShaded: false },
      ],
      [
        { value: '', solution: '.', isCircled: false, isShaded: false },
        { value: '', solution: 'Y', isCircled: false, isShaded: false },
        { value: '', solution: 'A', isCircled: false, isShaded: false },
        { value: '', solution: 'L', isCircled: false, isShaded: false },
        { value: '', solution: 'L', isCircled: false, isShaded: false },
      ],
      [
        { value: '', solution: 'T', isCircled: false, isShaded: false },
        { value: '', solution: 'O', isCircled: false, isShaded: false },
        { value: '', solution: 'D', isCircled: false, isShaded: false },
        { value: '', solution: 'A', isCircled: false, isShaded: false },
        { value: '', solution: 'Y', isCircled: false, isShaded: false },
      ],
      [
        { value: '', solution: 'A', isCircled: false, isShaded: false },
        { value: '', solution: 'D', isCircled: false, isShaded: false },
        { value: '', solution: 'A', isCircled: false, isShaded: false },
        { value: '', solution: 'M', isCircled: false, isShaded: false },
        { value: '', solution: '.', isCircled: false, isShaded: false },
      ],
      [
        { value: '', solution: 'D', isCircled: false, isShaded: false },
        { value: '', solution: 'A', isCircled: false, isShaded: false },
        { value: '', solution: 'M', isCircled: false, isShaded: false },
        { value: '', solution: '.', isCircled: false, isShaded: false },
        { value: '', solution: '.', isCircled: false, isShaded: false },
      ],
    ],
    info: {
      type: 'Mini',
      title: 'NYT Mini Test',
      author: 'Some Editor',
      description: 'Words in boxes',
    },
    clues: {
      across: [
        'Show hosts, for short',
        '"You people," more informally',
        'Morning news show since 1952',
        'Conover of comedy',
        'Resevoir Structure',
      ],
      down: [
        '_____ Vice President, title for Kamala Harris',
        'Any animal in the class Bivalvia',
        'Like a knowning wink',
        'Oldest member of the Jedi Council',
        'Tiny bit',
      ],
    },
  };
  const testPuzzleAfterOneWord: CrosswordPuzzleModel = {
    grid: [
      [
        { value: '', solution: '.', isCircled: false, isShaded: false },
        { value: '', solution: '.', isCircled: false, isShaded: false },
        { value: 'M', solution: 'M', isCircled: false, isShaded: false },
        { value: '', solution: 'C', isCircled: false, isShaded: false },
        { value: '', solution: 'S', isCircled: false, isShaded: false },
      ],
      [
        { value: '', solution: '.', isCircled: false, isShaded: false },
        { value: '', solution: 'Y', isCircled: false, isShaded: false },
        { value: 'A', solution: 'A', isCircled: false, isShaded: false },
        { value: '', solution: 'L', isCircled: false, isShaded: false },
        { value: '', solution: 'L', isCircled: false, isShaded: false },
      ],
      [
        { value: '', solution: 'T', isCircled: false, isShaded: false },
        { value: '', solution: 'O', isCircled: false, isShaded: false },
        { value: 'D', solution: 'D', isCircled: false, isShaded: false },
        { value: '', solution: 'A', isCircled: false, isShaded: false },
        { value: '', solution: 'Y', isCircled: false, isShaded: false },
      ],
      [
        { value: '', solution: 'A', isCircled: false, isShaded: false },
        { value: '', solution: 'D', isCircled: false, isShaded: false },
        { value: 'A', solution: 'A', isCircled: false, isShaded: false },
        { value: '', solution: 'M', isCircled: false, isShaded: false },
        { value: '', solution: '.', isCircled: false, isShaded: false },
      ],
      [
        { value: '', solution: 'D', isCircled: false, isShaded: false },
        { value: '', solution: 'A', isCircled: false, isShaded: false },
        { value: 'M', solution: 'M', isCircled: false, isShaded: false },
        { value: '', solution: '.', isCircled: false, isShaded: false },
        { value: '', solution: '.', isCircled: false, isShaded: false },
      ],
    ],
    info: {
      type: 'Mini',
      title: 'NYT Mini Test',
      author: 'Some Editor',
      description: 'Words in boxes',
    },
    clues: {
      across: [
        'Show hosts, for short',
        '"You people," more informally',
        'Morning news show since 1952',
        'Conover of comedy',
        'Resevoir Structure',
      ],
      down: [
        '_____ Vice President, title for Kamala Harris',
        'Any animal in the class Bivalvia',
        'Like a knowning wink',
        'Oldest member of the Jedi Council',
        'Tiny bit',
      ],
    },
  };

  beforeEach(() => {
    const playerLocation: PlayerLocation = {
      moving: false,
      x: 0,
      y: 0,
      rotation: 'front',
    };
    testArea = new CrosswordPuzzleAreaController(nanoid(), false, testPuzzle, undefined);
    testArea.occupants = [
      new PlayerController(nanoid(), nanoid(), playerLocation),
      new PlayerController(nanoid(), nanoid(), playerLocation),
      new PlayerController(nanoid(), nanoid(), playerLocation),
    ];

    mockClear(mockListeners.occupantsChange);
    mockClear(mockListeners.puzzleChange);
    testArea.addListener('occupantsChange', mockListeners.occupantsChange);
    testArea.addListener('puzzleChange', mockListeners.puzzleChange);
  });
  describe('isEmpty', () => {
    it('Returns true if the occupants list is empty', () => {
      testArea.occupants = [];
      expect(testArea.isEmpty()).toBe(true);
    });
    it('Returns false if the occupants list is set and the puzzle is defined', () => {
      expect(testArea.isEmpty()).toBe(false);
    });
  });
  describe('setting the occupants property', () => {
    it('does not update the property if the new occupants are the same set as the old', () => {
      const origOccupants = testArea.occupants;
      const occupantsCopy = testArea.occupants.concat([]);
      const shuffledOccupants = occupantsCopy.reverse();
      testArea.occupants = shuffledOccupants;
      expect(testArea.occupants).toEqual(origOccupants);
      expect(mockListeners.occupantsChange).not.toBeCalled();
    });
    it('emits the occupantsChange event when setting the property and updates the model', () => {
      const newOccupants = testArea.occupants.slice(1);
      testArea.occupants = newOccupants;
      expect(testArea.occupants).toEqual(newOccupants);
      expect(mockListeners.occupantsChange).toBeCalledWith(newOccupants);
      expect(testArea.toCrosswordPuzzleAreaModel()).toEqual({
        id: testArea.id,
        isGameOver: testArea.isGameOver,
        puzzle: testArea.puzzle,
        leaderboard: testArea.leaderboard,
        occupantsByID: testArea.occupants.map(eachOccupant => eachOccupant.id),
      });
    });
  });
  describe('setting the puzzle property', () => {
    it('does not update the puzzle if the new puzzle is the same set as the old', () => {
      const puzzleOrig = testArea.puzzle;
      const puzzleCopy = testPuzzle;
      testArea.puzzle = puzzleCopy;
      expect(testArea.puzzle).toEqual(puzzleOrig);
      expect(mockListeners.puzzleChange).not.toBeCalled();
    });
    it('emits the puzzleChange event when setting the puzzle and updates the model', () => {
      testArea.puzzle = testPuzzleAfterOneWord;
      expect(testArea.puzzle).toEqual(testPuzzleAfterOneWord);
      expect(mockListeners.puzzleChange).toBeCalledWith(testPuzzleAfterOneWord);
      expect(testArea.toCrosswordPuzzleAreaModel()).toEqual({
        id: testArea.id,
        isGameOver: testArea.isGameOver,
        puzzle: testArea.puzzle,
        leaderboard: testArea.leaderboard,
        occupantsByID: testArea.occupants.map(eachOccupant => eachOccupant.id),
      });
    });
    it('emits the puzzleChange event and resets the puzzle if the new puzzle is undefined', () => {
      const setPuzzleMock = jest.spyOn(
        // Mocking a private method by creating a prototype as seen in
        // https://stackoverflow.com/questions/43265944/is-there-any-way-to-mock-private-functions-with-jest
        // eslint-disable-next-line
        CrosswordPuzzleAreaController.prototype as any,
        '_setPuzzleModel',
      );
      setPuzzleMock.mockImplementation(() => (testArea.puzzle = testPuzzle));

      testArea.puzzle = testPuzzleAfterOneWord;
      expect(testArea.puzzle).toEqual(testPuzzleAfterOneWord);

      testArea.puzzle = undefined;
      expect(setPuzzleMock).toHaveBeenCalled();
      expect(testArea.puzzle).toEqual(testPuzzle);
    });
  });
  describe('setting the isGameOver property', () => {
    // TODO - add when isGameOver event is complete (Shuhang)
  });
  describe('setting the leaderboard property', () => {
    // TODO - add when leaderboard backend is complete (Frank)
  });
});
