import { HStack, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import CrosswordPuzzleAreaController from '../../../classes/CrosswordPuzzleAreaController';
import useTownController from '../../../hooks/useTownController';
import {
  CellIndex,
  CrosswordPuzzleCell,
  CrosswordPuzzleModel,
  InsertScoreRequestBody,
  ScoreModel,
} from '../../../types/CoveyTownSocket';
import { BLACK_CELL_STRING, Direction, getHighlightedCells } from '../CrosswordUtils';
import CrosswordCell from './CrosswordCell/CrosswordCell';
import axios from 'axios';
import CrosswordClues from './CrosswordClues/CrosswordClues';
import CrosswordToolbar from './CrosswordToolbar/CrosswordToolbar';

type GameState = {
  selectedIndex: CellIndex;
  direction: Direction;
  highlightedCells: CellIndex[];
};

function CrosswordGrid({ controller }: { controller: CrosswordPuzzleAreaController }): JSX.Element {
  const toast = useToast();
  const townController = useTownController();
  const [puzzle, setPuzzle] = useState<CrosswordPuzzleModel | undefined>(controller.puzzle);

  const [gameState, setGameState] = useState<GameState>({
    selectedIndex: { row: 0, col: 0 },
    direction: 'across',
    highlightedCells: getHighlightedCells({ row: 0, col: 0 }, 'across', controller.puzzle?.grid),
  });

  const [isRebus, setRebus] = useState<boolean>(false);
  const isSelected = (cell: CellIndex): boolean => {
    return gameState.selectedIndex.row === cell.row && gameState.selectedIndex.col === cell.col;
  };
  const isHighlighted = (cell: CellIndex): boolean => {
    return (
      gameState.highlightedCells.findIndex(
        eachCell => cell.row === eachCell.row && cell.col === eachCell.col,
      ) !== -1
    );
  };
  const isCompleted = (grid: CrosswordPuzzleCell[][]) => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (
          grid[row][col].value !== grid[row][col].solution &&
          grid[row][col].solution !== BLACK_CELL_STRING
        ) {
          return false;
        }
      }
    }
    return true;
  };
  /**
   * Checks if a hint was used throughout the crossword
   * @param grid the crossword puzzle
   * @returns if a hint was used for any elements within the crossword
   */
  const hintUsed = (grid: CrosswordPuzzleCell[][]) => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (grid[row][col].usedHint) {
          return true;
        }
      }
    }
    return false;
  };
  /**
   * Makes api call to the database to insert a score provided a teamName and the time they started the given crossword.
   * It also creates a toast notifying a user the score they aachieved.
   * @param startTime the time the team started the crossword
   * @param groupName the name of the team completing the crossword
   * @param grid the crossword puzzle being completed
   */
  const insertScoreInDB = (startTime: number, groupName: string, grid: CrosswordPuzzleCell[][]) => {
    const currScore = (Date.now() - startTime) / 1000;
    try {
      let url = '';
      if (process.env.REACT_APP_TOWNS_SERVICE_URL !== undefined) {
        url = process.env.REACT_APP_TOWNS_SERVICE_URL.concat('/score');
      }
      if (process.env.PORT !== undefined) {
        url = process.env.PORT.concat('/score');
      }
      const newScore: ScoreModel = {
        teamName: groupName,
        score: currScore,
        teamMembers: controller.occupants.map(person => person.userName),
        usedHint: hintUsed(grid),
      };
      const requestBody: InsertScoreRequestBody = { scoreModel: newScore };
      axios.post(url, requestBody);
      toast({
        title: `Puzzle Finished!`,
        description: `Your Team Score is ${currScore}`,
        position: 'top',
        status: 'success',
        isClosable: true,
      });
    } catch (e) {
      throw new Error('Unable to set Leaderboard');
    }
  };
  useEffect(() => {
    controller.addListener('puzzleChange', setPuzzle);

    return () => {
      controller.removeListener('puzzleChange', setPuzzle);
    };
  }, [controller]);

  if (puzzle) {
    const handleRebusMode = () => {
      setRebus(!isRebus);
    };

    const handleCellChange = (rowIndex: number, columnIndex: number, newValue: string) => {
      const updatedGrid: CrosswordPuzzleCell[][] = puzzle.grid.map((row, i) => {
        return row.map((cell, j) => {
          if (i === rowIndex && j === columnIndex) {
            return {
              value: newValue,
              solution: cell.solution,
              isCircled: cell.isCircled,
              isShaded: cell.isShaded,
              usedHint: cell.usedHint,
            };
          } else {
            return cell;
          }
        });
      });

      controller.puzzle = { grid: updatedGrid, info: puzzle.info, clues: puzzle.clues };

      if (isCompleted(updatedGrid)) {
        controller.isGameOver = true;
        if (controller.startTime && controller.groupName) {
          insertScoreInDB(controller.startTime, controller.groupName, updatedGrid);
        } else {
          throw new Error('Start time or group name undefined');
        }
      }

      townController.emitCrosswordPuzzleAreaUpdate(controller);
    };

    const handleCellClick = (rowIndex: number, columnIndex: number) => {
      if (isSelected({ row: rowIndex, col: columnIndex })) {
        const newDirection = gameState.direction === 'across' ? 'down' : 'across';
        setGameState({
          ...gameState,
          direction: newDirection,
          highlightedCells: getHighlightedCells(
            { row: rowIndex, col: columnIndex },
            newDirection,
            puzzle.grid,
          ),
        });
      } else {
        setGameState({
          ...gameState,
          selectedIndex: { row: rowIndex, col: columnIndex },
          highlightedCells: getHighlightedCells(
            { row: rowIndex, col: columnIndex },
            gameState.direction,
            puzzle.grid,
          ),
        });
      }
    };

    const isNumberedCell = (rowIndex: number, columnIndex: number): boolean => {
      return (
        puzzle.grid[rowIndex][columnIndex].solution !== BLACK_CELL_STRING &&
        (rowIndex == 0 ||
          columnIndex == 0 ||
          puzzle.grid[rowIndex][columnIndex - 1].solution == BLACK_CELL_STRING ||
          puzzle.grid[rowIndex - 1][columnIndex].solution == BLACK_CELL_STRING)
      );
    };

    const handleCheckCell = () => {
      const updatedGrid: CrosswordPuzzleCell[][] = puzzle.grid.map((row, i) => {
        return row.map((cell, j) => {
          if (isSelected({ row: i, col: j })) {
            return {
              value: cell.value,
              solution: cell.solution,
              isCircled: cell.isCircled,
              isShaded: cell.isShaded,
              usedHint: true,
            };
          } else {
            return cell;
          }
        });
      });

      controller.puzzle = { grid: updatedGrid, info: puzzle.info, clues: puzzle.clues };
      townController.emitCrosswordPuzzleAreaUpdate(controller);
    };

    const handleCheckWord = () => {
      const updatedGrid: CrosswordPuzzleCell[][] = puzzle.grid.map((row, i) => {
        return row.map((cell, j) => {
          if (isSelected({ row: i, col: j }) || isHighlighted({ row: i, col: j })) {
            return {
              value: cell.value,
              solution: cell.solution,
              isCircled: cell.isCircled,
              isShaded: cell.isShaded,
              usedHint: true,
            };
          } else {
            return cell;
          }
        });
      });

      controller.puzzle = { grid: updatedGrid, info: puzzle.info, clues: puzzle.clues };
      townController.emitCrosswordPuzzleAreaUpdate(controller);
    };

    const handleCheckPuzzle = () => {
      const updatedGrid: CrosswordPuzzleCell[][] = puzzle.grid.map(row => {
        return row.map(cell => {
          return {
            value: cell.value,
            solution: cell.solution,
            isCircled: cell.isCircled,
            isShaded: cell.isShaded,
            usedHint: true,
          };
        });
      });

      controller.puzzle = { grid: updatedGrid, info: puzzle.info, clues: puzzle.clues };
      townController.emitCrosswordPuzzleAreaUpdate(controller);
    };

    const handleRevealPuzzle = () => {
      const updatedGrid: CrosswordPuzzleCell[][] = puzzle.grid.map(row => {
        return row.map(cell => {
          const newValue = cell.solution;
          return {
            value: newValue,
            solution: cell.solution,
            isCircled: cell.isCircled,
            isShaded: cell.isShaded,
            usedHint: true,
          };
        });
      });

      controller.puzzle = { grid: updatedGrid, info: puzzle.info, clues: puzzle.clues };
      controller.isGameOver = true;

      if (controller.startTime && controller.groupName) {
        insertScoreInDB(controller.startTime, controller.groupName, updatedGrid);
      } else {
        throw new Error('Start time or group name undefined');
      }

      townController.emitCrosswordPuzzleAreaUpdate(controller);
    };

    let counter = 0;

    const rows = puzzle.grid.map((row, i) => {
      const cells = row.map((cell, j) => {
        if (isNumberedCell(i, j)) {
          counter = counter + 1;
          return (
            <CrosswordCell
              key={`${i}_${j}`}
              number={counter}
              cellID={`${i}_${j}`}
              isRebus={isRebus}
              isSelected={isSelected({ row: i, col: j })}
              isHighlighted={isHighlighted({ row: i, col: j })}
              cellModel={cell}
              onChange={handleCellChange}
              onClick={handleCellClick}
            />
          );
        } else {
          return (
            <CrosswordCell
              key={`${i}_${j}`}
              number={undefined}
              cellID={`${i}_${j}`}
              isRebus={isRebus}
              isSelected={isSelected({ row: i, col: j })}
              isHighlighted={isHighlighted({ row: i, col: j })}
              cellModel={cell}
              onChange={handleCellChange}
              onClick={handleCellClick}
            />
          );
        }
      });
      return <tr key={i}>{cells}</tr>;
    });

    return (
      <>
        <CrosswordToolbar
          controller={controller}
          handleRebusProps={{ isRebus: isRebus, handleRebus: handleRebusMode }}
          handleCheckProps={{
            handleCheckCell: handleCheckCell,
            handleCheckWord: handleCheckWord,
            handleCheckPuzzle: handleCheckPuzzle,
            handleRevealPuzzle: handleRevealPuzzle,
          }}
        />
        <HStack>
          <table id='crossword-grid' style={{ borderCollapse: 'collapse' }}>
            <tbody>{rows}</tbody>
          </table>
          <CrosswordClues acrossClues={puzzle.clues.across} downClues={puzzle.clues.down} />
        </HStack>
      </>
    );
  } else {
    return <></>;
  }
}

export default CrosswordGrid;
