import React from 'react';
import { CrosswordPuzzleCell } from '../../../../types/CoveyTownSocket';
import './CrosswordCell.css';

function CrosswordCell(props: {
  cellID: string;
  number: number | undefined;
  isRebus: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  cellModel: CrosswordPuzzleCell;
  onChange: (rowIndex: number, columnIndex: number, newValue: string) => void;
  onClick: (rowIndex: number, columnIndex: number) => void;
}): JSX.Element {
  const handleCellChange = (newValue: string) => {
    let text = newValue.toUpperCase();
    if (text.length > 1 && !props.isRebus) {
      text = text.slice(0, 1);
    }

    const row = parseInt(props.cellID.slice(0, props.cellID.indexOf('_')));
    const col = parseInt(props.cellID.slice(props.cellID.indexOf('_') + 1));

    props.onChange(row, col, text);
  };

  const handleCellClick = () => {
    const row = parseInt(props.cellID.slice(0, props.cellID.indexOf('_')));
    const col = parseInt(props.cellID.slice(props.cellID.indexOf('_') + 1));

    props.onClick(row, col);
  };

  if (props.cellModel.solution === '.') {
    return <td className='filled'></td>;
  }
  if (props.cellModel.isCircled) {
    return (
      <td className='circled'>
        <span>{props.number}</span>
        <input
          value={props.cellModel.value}
          onChange={e => handleCellChange(e.target.value)}
          onClick={() => handleCellClick()}
        />
      </td>
    );
  }
  if (props.cellModel.isShaded) {
    return (
      <td className='shaded'>
        <span>{props.number}</span>
        <input
          value={props.cellModel.value}
          onChange={e => handleCellChange(e.target.value)}
          onClick={() => handleCellClick()}
        />
      </td>
    );
  }
  if (props.isHighlighted && !props.isSelected) {
    return (
      <td className='highlighted'>
        <span>{props.number}</span>
        <input
          value={props.cellModel.value}
          onChange={e => handleCellChange(e.target.value)}
          onClick={() => handleCellClick()}
        />
      </td>
    );
  }
  if (props.isSelected) {
    return (
      <td className='selected'>
        <span>{props.number}</span>
        <input
          value={props.cellModel.value}
          onChange={e => handleCellChange(e.target.value)}
          onClick={() => handleCellClick()}
        />
      </td>
    );
  }
  return (
    <td>
      <span>{props.number}</span>
      <input
        value={props.cellModel.value}
        onChange={e => handleCellChange(e.target.value)}
        onClick={() => handleCellClick()}
      />
    </td>
  );
}

export default CrosswordCell;
