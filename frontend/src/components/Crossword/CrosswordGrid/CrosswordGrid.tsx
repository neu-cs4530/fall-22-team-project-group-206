import { HStack, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import CrosswordPuzzleAreaController from '../../../classes/CrosswordPuzzleAreaController';
import useTownController from '../../../hooks/useTownController';
import {
  CellIndex,
  CrosswordPuzzleCell,
  CrosswordPuzzleModel,
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
        try {
          if (process.env.REACT_APP_TOWNS_SERVICE_URL !== undefined) {
            const newScore = {
              teamName: controller.groupName,
              score: 0,
              teamMembers: controller.occupants.map((person) => person.userName),
              usedHint: false
            }
            const url = process.env.REACT_APP_TOWNS_SERVICE_URL.concat('/score');
            const scoreResp = axios.post(url, newScore);
          }
        } catch (e) {
          throw new Error('Unable to set Leaderboard');
        }
        toast({
          title: `Puzzle Finished!`,
          description: 'Your Team Score is ...',
          position: 'top',
          status: 'success',
          isClosable: true,
        });
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
      toast({
        title: `Puzzle Finished!`,
        description: 'Your Team Score is ...',
        position: 'top',
        status: 'success',
        isClosable: true,
      });

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
