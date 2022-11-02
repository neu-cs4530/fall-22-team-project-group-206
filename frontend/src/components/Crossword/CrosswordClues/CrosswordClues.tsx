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
  function createClueView(clue: string | null, clueNumber: number): JSX.Element | null {
    return clue !== null ? <ClueView clueNumber={clueNumber} clue={clue} /> : null;
  }

  const acrossCluesView = props.acrossClues
    .map((clue, clueNumber) => createClueView(clue, clueNumber))
    .filter(clueView => clueView !== null);

  const downCluesView = props.downClues
    .map((clue, clueNumber) => createClueView(clue, clueNumber))
    .filter(clueView => clueView !== null);

  return (
    <>
      <div className='clues-list'>
        <span>Across</span>
        <ul>{acrossCluesView}</ul>
      </div>
      <div className='clues-list'>
        <span>Down</span>
        <ul>{downCluesView}</ul>
      </div>
    </>
  );
}

export default CrosswordClues;
