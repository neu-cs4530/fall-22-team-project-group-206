import { VStack } from '@chakra-ui/react';
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
    return clue !== null ? <ClueView key={clueNumber} clueNumber={clueNumber} clue={clue} /> : null;
  }

  function createClueViews(clueList: (string | null)[]): (JSX.Element | null)[] {
    return clueList
      .map((clue, clueNumber) => createClueView(clue, clueNumber))
      .filter(clueView => clueView !== null);
  }

  const acrossCluesView = createClueViews(props.acrossClues);
  const downCluesView = createClueViews(props.downClues);

  return (
    <VStack>
      <div className='clues-list'>
        <span>Across</span>
        <ul>{acrossCluesView}</ul>
      </div>
      <div className='clues-list'>
        <span>Down</span>
        <ul>{downCluesView}</ul>
      </div>
    </VStack>
  );
}

export default CrosswordClues;
