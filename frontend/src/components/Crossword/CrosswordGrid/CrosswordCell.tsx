import React from 'react';

import './CrosswordCell.css';

const CrosswordCell = (props: {
  cellID: string,
  isRebus: boolean,
  isSelected: boolean;
  isShaded: boolean;
  isCircled: boolean;
  isHighlighted: boolean;
  value: string;
  onChange: (row: number, column: number, newValue: string) => void;
  onClick: (row: number, column: number) => void;
}) => {
  const handleCellChange = (newValue: string) => {
    let text = newValue.toUpperCase()
    if (text.length > 1 && !props.isRebus) {
      text = text.slice(0, 1)
    }
    const row = parseInt(props.cellID.slice(0, props.cellID.indexOf('-')))
    const col = parseInt(props.cellID.slice(props.cellID.indexOf('-') + 1))
    
    props.onChange(
      row,
      col,
      text
    )
  }

  const handleCellClick = () => {
    const row = parseInt(props.cellID.slice(0, props.cellID.indexOf('-')))
    const col = parseInt(props.cellID.slice(props.cellID.indexOf('-') + 1))
    
    props.onClick(
      row,
      col
    )
  }

  if (props.value === '.') {
    return <td className='filled'></td>;
  }
  if (props.isCircled) {
    return <td className='circled'>
      <input 
        value={props.value} 
        onChange={e => handleCellChange(e.target.value)}
        onClick={() => handleCellClick()} />
    </td>;
  }
  if (props.isShaded) {
    return <td className='shaded'>
      <input 
        value={props.value} 
        onChange={e => handleCellChange(e.target.value)}
        onFocus={() => handleCellClick()} />
    </td>;
  }
  if (props.isHighlighted) {
    return <td className='highlighted'>
      <input 
        value={props.value} 
        onChange={e => handleCellChange(e.target.value)}
        onFocus={() => handleCellClick()} />
    </td>;
  }
  if (props.isSelected) {
    return <td className='selected'>
      <input 
        value={props.value} 
        onChange={e => handleCellChange(e.target.value)}
        onFocus={() => handleCellClick()} />
    </td>;
  }
  return (
    <td>
      <input 
        value={props.value} 
        onChange={e => handleCellChange(e.target.value)}
        onFocus={() => handleCellClick()} />
    </td>
  );
};

export default CrosswordCell;
