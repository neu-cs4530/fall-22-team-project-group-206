import React from 'react';
import { CrosswordPuzzleCell } from '../../../../types/CoveyTownSocket';
import './CrosswordCell.css';

function CrosswordCell(props: {
  cellID: string;
  isRebus: boolean;
  isSelected: boolean;
  cellModel: CrosswordPuzzleCell;
  onChange: (rowIndex: number, columnIndex: number, newValue: string) => void;
  onClick: (rowIndex: number, columnIndex: number) => void;
}): JSX.Element {
  const handleCellChange = (newValue: string) => {
    let text = newValue.toUpperCase();
    if (text.length > 1 && !props.isRebus) {
      text = text.slice(0, 1);
    }

    const row = parseInt(props.cellID.slice(0, props.cellID.indexOf('-')));
    const col = parseInt(props.cellID.slice(props.cellID.indexOf('-') + 1));

    props.onChange(row, col, text);
  };

  const handleCellClick = () => {
    const row = parseInt(props.cellID.slice(0, props.cellID.indexOf('-')));
    const col = parseInt(props.cellID.slice(props.cellID.indexOf('-') + 1));

    props.onClick(row, col);
  };

  if (props.cellModel.solution === '.') {
    return <td className='filled'></td>;
  }
  if (props.cellModel.isCircled) {
    return (
      <td className='circled'>
        <input
          value={props.cellModel.value}
          onChange={e => handleCellChange(e.target.value)}
          onClick={() => handleCellClick()}
          onFocus={() => handleCellClick()}
        />
      </td>
    );
  }
  if (props.cellModel.isShaded) {
    return (
      <td className='shaded'>
        <input
          value={props.cellModel.value}
          onChange={e => handleCellChange(e.target.value)}
          onClick={() => handleCellClick()}
          onFocus={() => handleCellClick()}
        />
      </td>
    );
  }
  if (props.isSelected) {
    return (
      <td className='selected'>
        <input
          value={props.cellModel.value}
          onChange={e => handleCellChange(e.target.value)}
          onClick={() => handleCellClick()}
          onFocus={() => handleCellClick()}
        />
      </td>
    );
  }
  return (
    <td>
      <input
        value={props.cellModel.value}
        onChange={e => handleCellChange(e.target.value)}
        onClick={() => handleCellClick()}
        onFocus={() => handleCellClick()}
      />
    </td>
  );
}

export default CrosswordCell;
