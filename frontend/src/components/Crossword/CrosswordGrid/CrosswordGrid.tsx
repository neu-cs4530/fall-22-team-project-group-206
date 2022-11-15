import React, { useState } from 'react';
import CrosswordPuzzleAreaController from '../../../classes/CrosswordPuzzleAreaController';
import { CrosswordPuzzleCell } from '../../../types/CoveyTownSocket';
import CrosswordCell from './CrosswordCell/CrosswordCell';

type CellIndex = { row: number; col: number };

function CrosswordGrid({ controller }: { controller: CrosswordPuzzleAreaController }): JSX.Element {
  const [grid, setGrid] = useState<CrosswordPuzzleCell[][] | undefined>(controller.puzzle?.grid);
  const [selected, setSelected] = useState<CellIndex>({ row: 0, col: 0 });
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const isSelected = (cell: CellIndex): boolean => {
    return selected.row === cell.row && selected.col === cell.col;
  };

  if (grid) {
    const handleCellChange = (rowIndex: number, columnIndex: number, newValue: string) => {
      const updatedGrid: CrosswordPuzzleCell[][] = grid.map((row, i) => {
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

      setGrid(updatedGrid);
    };

    const handleCellClick = (rowIndex: number, columnIndex: number) => {
      if (isSelected({ row: rowIndex, col: columnIndex })) {
        const newDirection = direction === 'across' ? 'down' : 'across';
        setDirection(newDirection);
      }
      setSelected({ row: rowIndex, col: columnIndex });
    };

    const rows = grid.map((row, i) => {
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
