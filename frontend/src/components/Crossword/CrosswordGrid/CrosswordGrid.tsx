import React, { useEffect, useState } from 'react';
import CrosswordPuzzleAreaController from '../../../classes/CrosswordPuzzleAreaController';
import useTownController from '../../../hooks/useTownController';
import { CrosswordPuzzleCell, CrosswordPuzzleModel } from '../../../types/CoveyTownSocket';
import CrosswordCell from './CrosswordCell/CrosswordCell';
import { useToast } from '@chakra-ui/react';

type CellIndex = { row: number; col: number };

function CrosswordGrid({ controller }: { controller: CrosswordPuzzleAreaController }): JSX.Element {
  const townController = useTownController();
  const [puzzle, setPuzzle] = useState<CrosswordPuzzleModel | undefined>(controller.puzzle);

  const [selected, setSelected] = useState<CellIndex>({ row: 0, col: 0 });
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const toast = useToast();
  const isSelected = (cell: CellIndex): boolean => {
    return selected.row === cell.row && selected.col === cell.col;
  };
  const isCompleted = (grid: CrosswordPuzzleCell[][]) => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (grid[row][col].value !== grid[row][col].solution && grid[row][col].solution !== '.') {
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

      if (isCompleted(updatedGrid)) {
        controller.isGameOver = true;
        toast({
          title: `Puzzle Finished!`,
          description: 'Your Team Score is ...',
          position: 'top',
          status: 'success',
          isClosable: true,
        });
      }

      controller.puzzle = { grid: updatedGrid, info: puzzle.info, clues: puzzle.clues };
      townController.emitCrosswordPuzzleAreaUpdate(controller);
    };

    const handleCellClick = (rowIndex: number, columnIndex: number) => {
      if (isSelected({ row: rowIndex, col: columnIndex })) {
        const newDirection = direction === 'across' ? 'down' : 'across';
        setDirection(newDirection);
      }
      setSelected({ row: rowIndex, col: columnIndex });
    };

    const rows = puzzle.grid.map((row, i) => {
      const cells = row.map((cell, j) => {
        return (
          <CrosswordCell
            key={i + j}
            cellID={`${i}-${j}`}
            isRebus={false}
            isSelected={isSelected({ row: i, col: j })}
            cellModel={cell}
            onChange={handleCellChange}
            onClick={handleCellClick}
          />
        );
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
