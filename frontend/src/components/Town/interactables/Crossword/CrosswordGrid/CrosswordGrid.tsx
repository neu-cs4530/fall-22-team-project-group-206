import React, { useState } from 'react';
import CrosswordCell from './CrosswordCell';

function CrosswordGrid(props: { xw: string[][] }): JSX.Element {
  const solution = props.xw;
  const [grid, setGrid] = useState<string[][]>(
    props.xw.map(row => row.map(val => (val !== '.' ? '' : val))),
  );
  const [selected, setSelected] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const [direction, setDirection] = useState<'across' | 'down'>('across');

  const [isGameOver, updateIsGameOver] = useState<boolean>(false);

  const isSelected = (row: number, col: number): boolean => {
    return selected.row === row && selected.col === col;
  };

  const isHighlighted = (row: number, col: number): boolean => {
    return false;
  };

  const isShaded = (row: number, col: number): boolean => {
    return false;
  };

  const isCircled = (row: number, col: number): boolean => {
    return false;
  };

  const isSolved = (): boolean => {
    let solved = true;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] !== solution[i][j]) {
          solved = false;
        }
      }
    }
    return solved;
  };

  const handleCellClick = (rowIndex: number, columnIndex: number) => {
    if (isSelected(rowIndex, columnIndex)) {
      const newDirection = direction === 'across' ? 'down' : 'across';
      setDirection(newDirection);
    }
    setSelected({ row: rowIndex, col: columnIndex });
  };

  const handleCellChange = (rowIndex: number, columnIndex: number, newValue: string) => {
    if (!isGameOver) {
      const updatedGrid: string[][] = grid.map((row, i) => {
        return row.map((cell, j) => {
          if (i === rowIndex && j === columnIndex) {
            return newValue;
          } else {
            return cell;
          }
        });
      });

      setGrid(updatedGrid);
      if (isSolved()) {
        updateIsGameOver(true);
      }
    }
  };

  const rows = grid.map((row, i) => {
    const cells = row.map((cell, j) => {
      return (
        <CrosswordCell
          key={i + j}
          cellID={`${i}-${j}`}
          isRebus={false}
          isHighlighted={isHighlighted(i, j)}
          isSelected={isSelected(i, j)}
          isShaded={isShaded(i, j)}
          isCircled={isCircled(i, j)}
          value={cell}
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
}

export default CrosswordGrid;
