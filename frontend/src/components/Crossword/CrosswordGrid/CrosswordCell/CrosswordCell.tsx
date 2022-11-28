import React from 'react';
import { CrosswordPuzzleCell } from '../../../../types/CoveyTownSocket';
import './CrosswordCell.css';

const FONT_SIZE = '1rem';
const REBUS_FONT_SIZE = '0.5rem';

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
  let fontSize = props.cellModel.value.length <= 1 ? FONT_SIZE : REBUS_FONT_SIZE;
  const handleCellChange = (newValue: string) => {
    let text = newValue.toUpperCase();
    if (text.length > 1 && !props.isRebus) {
      text = text.slice(0, 1);
    }
    if (props.isRebus && text.length > 1) {
      fontSize = '0.4rem';
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

  const styleClassNames = [];

  if (props.isHighlighted) {
    styleClassNames.push('highlighted');
  }

  if (props.isSelected) {
    styleClassNames.push('selected');
  }

  if (props.cellModel.isCircled) {
    styleClassNames.push('circled');
  }

  if (props.cellModel.isShaded) {
    styleClassNames.push('shaded');
  }

  if (props.cellModel.usedHint && props.cellModel.value === props.cellModel.solution) {
    styleClassNames.push('checked_correct');
    return (
      <td className={styleClassNames.join(' ')}>
        <span>{props.number}</span>
        <input
          style={{ fontSize: fontSize }}
          value={props.cellModel.value}
          onClick={() => handleCellClick()}
          readOnly
        />
      </td>
    );
  }
  if (props.cellModel.usedHint && props.cellModel.value !== props.cellModel.solution) {
    styleClassNames.push('checked_incorrect');
  }
  return (
    <td className={styleClassNames.join(' ')}>
      <span>{props.number}</span>
      <input
        style={{ fontSize: fontSize }}
        value={props.cellModel.value}
        onChange={e => handleCellChange(e.target.value)}
        onClick={() => handleCellClick()}
      />
    </td>
  );
}

export default CrosswordCell;
