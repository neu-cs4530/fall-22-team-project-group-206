import React, { useState } from 'react';
import CrosswordCell from './CrosswordCell/CrosswordCell';

function CrosswordGrid(props: { xw: string[][] }): JSX.Element {
  const [grid, setGrid] = useState<string[][]>(
    props.xw.map(row => row.map(val => (val !== '.' ? '' : val))),
  );
  const [selected, setSelected] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const isSelected = (row: number, col: number): boolean => {
    return selected.row === row && selected.col === col;
  };

  const rows = grid.map((row, i) => {
    const cells = row.map((cell, j) => {
      return (
        <CrosswordCell
          key={i + j}
          cellID={`${i}-${j}`}
          isRebus={false}
          isSelected={isSelected(i, j)}
          value={cell}
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
