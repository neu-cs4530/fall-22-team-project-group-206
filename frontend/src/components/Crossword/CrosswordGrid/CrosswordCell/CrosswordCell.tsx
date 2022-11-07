import React from 'react';

import './CrosswordCell.css';

function CrosswordCell(props: {
  cellID: string;
  isRebus: boolean;
  isSelected: boolean;
  value: string;
}): JSX.Element {

  if (props.value === '.') {
    return <td className='filled'></td>;
  }
  if (props.isSelected) {
    return (
      <td className='selected'>
        <input
          value={props.value}
        />
      </td>
    );
  }
  return (
    <td>
      <input
        value={props.value}
      />
    </td>
  );
}

export default CrosswordCell;
