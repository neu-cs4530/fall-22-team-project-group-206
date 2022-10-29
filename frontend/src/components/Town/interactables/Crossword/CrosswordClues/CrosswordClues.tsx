import React from 'react';

import './CrosswordClues.css';

function ClueView(props: { clueNumber: number; clue: string }): JSX.Element {
  return (
    <li>
      {props.clueNumber}. {props.clue}
    </li>
  );
}

function CrosswordClues(props: {
  acrossClues: (string | null)[];
  downClues: (string | null)[];
}): JSX.Element {
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
}

export default CrosswordClues;
