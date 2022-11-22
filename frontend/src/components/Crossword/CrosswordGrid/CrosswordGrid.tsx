import { useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import CrosswordPuzzleAreaController from '../../../classes/CrosswordPuzzleAreaController';
import useTownController from '../../../hooks/useTownController';
import { CrosswordPuzzleCell, CrosswordPuzzleModel } from '../../../types/CoveyTownSocket';
import CrosswordCell from './CrosswordCell/CrosswordCell';

type CellIndex = { row: number; col: number };
type Direction = 'across' | 'down'
const BLACK_CELL_STRING = '.';

function CrosswordGrid({ controller }: { controller: CrosswordPuzzleAreaController }): JSX.Element {
  const toast = useToast();
  const townController = useTownController();
  const [puzzle, setPuzzle] = useState<CrosswordPuzzleModel | undefined>(controller.puzzle);

  const [selected, setSelected] = useState<CellIndex>({ row: 0, col: 0 });
  const [direction, setDirection] = useState<Direction>('across');
  const [highlightedCells, setHighlightedCells] = useState();

  const isSelected = (cell: CellIndex): boolean => {
    return selected.row === cell.row && selected.col === cell.col;
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
    const getHighlightedCells = (cellIndex: CellIndex, direction: Direction): CellIndex[] => {
      const highlightedIndices: CellIndex[];
      switch (direction) {
        case 'across':
          
          break;
        case 'down':

          break;
      }
    }

    const handleCellChange = (rowIndex: number, columnIndex: number, newValue: string) => {
      const updatedGrid: CrosswordPuzzleCell[][] = puzzle.grid.map((row, i) => {
        return row.map((cell, j) => {
          if (i === rowIndex && j === columnIndex) {
            return {
              value: newValue,
              solution: cell.solution,
              isCircled: cell.isCircled,
              isShaded: cell.isShaded,
            };
          } else {
            return cell;
          }
        });
      });

      controller.puzzle = { grid: updatedGrid, info: puzzle.info, clues: puzzle.clues };

      if (isCompleted(updatedGrid)) {
        controller.isGameOver = true;
        // Call to API to add Score
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
        const newDirection = direction === 'across' ? 'down' : 'across';
        console.log('Old dir', direction, 'New dir', newDirection);
        setDirection(newDirection);
      }
      setSelected({ row: rowIndex, col: columnIndex });
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
              isRebus={false}
              isSelected={isSelected({ row: i, col: j })}
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
              isRebus={false}
              isSelected={isSelected({ row: i, col: j })}
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
      <table style={{ borderCollapse: 'collapse' }}>
        <tbody>{rows}</tbody>
      </table>
    );
  } else {
    return <></>;
  }
}

export default CrosswordGrid;
