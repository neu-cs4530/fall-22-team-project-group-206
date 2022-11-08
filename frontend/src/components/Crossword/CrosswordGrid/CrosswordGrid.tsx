import React, { useState } from 'react';
import CrosswordCell from './CrosswordCell/CrosswordCell';

type CellIndex = { row: number; col: number };

function CrosswordGrid(props: { xw: string[][] }): JSX.Element {
  // TODO: these setters will be used in the controller
  const [grid, setGrid] = useState<string[][]>(
    props.xw.map(row => row.map(val => (val !== '.' ? '' : val))),
  );
  const [selected, setSelected] = useState<CellIndex>({ row: 0, col: 0 });
  const isSelected = (cell: CellIndex): boolean => {
    return selected.row === cell.row && selected.col === cell.col;
  };

  const rows = grid.map((row, i) => {
    const cells = row.map((cell, j) => {
      return (
        <CrosswordCell
          key={i + j}
          cellID={`${i}-${j}`}
          isRebus={false}
          isSelected={isSelected({ row: i, col: j})}
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
