import React from 'react';
import CrosswordGrid from './CrosswordGrid/CrosswordGrid';
import CrosswordClues from './CrosswordClues/CrosswordClues';

import './CrosswordGame.css';

const xwData = {
  pid: '23804',
  content: {
    grid: [
      ['P', 'A', 'L', '.', 'G', 'A', 'R', 'A', 'G', 'E', '.', 'C', 'A', 'P', 'S'],
      ['A', 'L', 'A', '.', 'I', 'C', 'O', 'N', 'I', 'C', '.', 'O', 'L', 'E', 'O'],
      ['I', 'F', 'I', 'M', 'B', 'E', 'I', 'N', 'G', 'H', 'O', 'N', 'E', 'S', 'T'],
      ['L', 'A', 'D', 'I', 'E', 'S', '.', '.', 'G', 'I', 'N', 'G', 'K', 'O', '.'],
      ['.', '.', 'E', 'L', 'S', '.', 'W', 'I', 'E', 'N', 'E', 'R', '.', '.', '.'],
      ['B', 'O', 'Y', 'O', '.', 'H', 'O', 'N', 'D', 'O', '.', 'A', 'H', 'A', 'B'],
      ['A', 'P', 'E', '.', 'M', 'O', 'R', 'T', '.', 'D', 'A', 'T', 'I', 'V', 'E'],
      ['R', 'E', 'S', 'E', 'R', 'V', 'E', 'O', 'N', 'E', 'S', 'S', 'P', 'O', 'T'],
      ['B', 'R', 'O', 'N', 'T', 'E', '.', 'T', 'E', 'R', 'P', '.', 'P', 'I', 'T'],
      ['S', 'A', 'N', 'D', '.', 'R', 'E', 'A', 'R', 'M', '.', 'H', 'Y', 'D', 'E'],
      ['.', '.', '.', 'G', 'O', 'B', 'A', 'L', 'D', '.', 'G', 'O', 'D', '.', '.'],
      ['.', 'B', 'E', 'A', 'V', 'I', 'S', '.', '.', 'E', 'E', 'R', 'I', 'E', 'R'],
      ['A', 'N', 'D', 'M', 'A', 'K', 'E', 'I', 'T', 'S', 'N', 'A', 'P', 'P', 'Y'],
      ['P', 'A', 'G', 'E', '.', 'E', 'U', 'R', 'O', 'P', 'E', '.', 'P', 'E', 'A'],
      ['T', 'I', 'E', 'S', '.', 'S', 'P', 'A', 'W', 'N', 'S', '.', 'Y', 'E', 'N'],
    ],
    info: {
      type: 'Daily Puzzle',
      title: 'NY Times, Tuesday, October 18, 2022',
      author: 'Dan Schoenholz / Will Shortz',
      description: '',
    },
    clues: {
      down: [
        null,
        'Item on a bucket list?',
        '___ Romeo (Italian auto)',
        'Got a look at',
        'Cutting remarks',
        'High or low cards',
        'Louis XIV, par exemple',
        '___ Taylor (clothier)',
        'Played a couple of sets at a jazz club, say',
        'Starfish or sea urchin, in a biology text',
        '"Major props to you!"',
        'Fashion model Wek',
        '100 centavos',
        'Barfly',
        null,
        null,
        null,
        null,
        'Venus de ___',
        '1',
        null,
        null,
        null,
        'Had on',
        'Counting everything',
        'Cutting remarks',
        'John Adams\'s "Nixon in China," for one',
        'Futuristic modes of transport',
        null,
        'New-Agey, slangily',
        'Dodge',
        '"___ Davis Eyes" (Kim Carnes hit of 1981)',
        null,
        '"The A-Team" actor with a mohawk',
        null,
        'African serpent',
        null,
        'Chess match finales',
        'Brainy oddball',
        null,
        null,
        null,
        null,
        null,
        'Slacken',
        'Group wedding dance',
        null,
        'Laboratory eggs',
        'Cute reply to "Why are you so cute?" ',
        "___ B'rith (Jewish organization)",
        'Leg up',
        'TV network that organizes the X Games',
        'Fencing option',
        'TV host Seacrest',
        'Missing letters in "??propria?e" (felicitously)',
        'Savings plan with SEP and SIMPLE versions',
        'Pull along',
      ],
      across: [
        null,
        'Bud',
        null,
        null,
        'Tow truck destination',
        null,
        null,
        null,
        null,
        null,
        'Puts a lid on',
        null,
        null,
        null,
        '___ carte menu',
        'Widely recognized, as a symbol',
        'Butter alternative',
        '"Truthfully ..."',
        null,
        null,
        'The "L" of L.P.G.A.',
        '___ biloba (ornamental tree with a widely used extract)',
        'Trains at a high level?',
        'Hot dog',
        null,
        'Irish laddie',
        null,
        '1953 title role for John Wayne',
        'Captain in a whale of a tale?',
        null,
        null,
        null,
        'Mimic',
        'Comedian Sahl',
        'Grammatical case in Latin',
        null,
        'Secure a seat at the table, say',
        null,
        null,
        'Emily who wrote "Wuthering Heights"',
        'Univ. of Maryland athlete',
        '___ stop (chance to refuel)',
        "Golfers don't want to go into it",
        'Prepare to break a peace treaty, perhaps',
        null,
        'Mr. in a Robert Louis Stevenson story',
        'Emulate Mr. Clean, in a way',
        null,
        'Mars or Jupiter',
        "Butt-head's sidekick",
        null,
        'More ghostly',
        null,
        null,
        '"Hurry up!"',
        null,
        null,
        'Leaf (through)',
        'Home to Slovenia and Slovakia',
        'Royal irritant in a fairy tale',
        'Makes into a knot',
        'Brings into being',
        'Hankering',
      ],
    },
    shades: [],
    circles: [30, 33, 39, 40, 105, 107, 110, 117, 180, 189, 191, 192],
    private: false,
  },
  stats: { numSolves: 150 },
};

function CrosswordGame(): JSX.Element {
  return (
    <div className='container'>
      <div style={{ gridColumnStart: '1', gridColumnEnd: '1', gridRowEnd: '2' }}>
        <CrosswordGrid xw={xwData.content.grid} />
      </div>
      <div style={{ gridColumnStart: '2', gridRowEnd: '2' }}>
        <CrosswordClues
          acrossClues={xwData.content.clues.across}
          downClues={xwData.content.clues.down}
        />
      </div>
    </div>
  );
}

export default CrosswordGame;
