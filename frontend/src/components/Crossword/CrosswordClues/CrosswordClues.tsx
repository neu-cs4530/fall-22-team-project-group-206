import React from 'react';

import './CrosswordClues.css'

const CrosswordClues = (props: {
  acrossClues: (string | null)[];
  downClues: (string | null)[];
}) => {
  const acrossCluesView = props.acrossClues
    .map((clue, i) => {
      if (clue !== null) {
        return <ClueView clueNumber={i} clue={clue} />;
      }
      return null;
    })
    .filter(clueView => clueView !== null);
  const downCluesView = props.downClues
    .map((clue, i) => {
      if (clue !== null) {
        return <ClueView clueNumber={i} clue={clue} />;
      }
      return null;
    })
    .filter(clueView => clueView !== null);
  return (
    <div>
      <div className='clues-list'>
        <span>Across</span>
        <ul>{acrossCluesView}</ul>
      </div>
      <div className='clues-list'>
        <span>Down</span>
        <ul>{downCluesView}</ul>
      </div>
    </div>
  );
};

const ClueView = (props: { clueNumber: number; clue: string }) => {
  return (
    <li>
      {props.clueNumber}. {props.clue}
    </li>
  );
};

export default CrosswordClues;
