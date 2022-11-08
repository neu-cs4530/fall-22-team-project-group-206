import React from 'react';
import { CrosswordPuzzleCell } from '../../../../types/CoveyTownSocket';

import './CrosswordCell.css';

function CrosswordCell(props: {
  cellID: string;
  isRebus: boolean;
  isSelected: boolean;
  cellModel: CrosswordPuzzleCell;
}): JSX.Element {
  if (props.cellModel.value === '.') {
    return <td className='filled'></td>;
  }
  if (props.isSelected) {
    return (
      <td className='selected'>
        <input value={props.cellModel.value} />
      </td>
    );
  }
  return (
    <td>
      <input value={props.cellModel.value} />
    </td>
  );
}

export default CrosswordCell;
