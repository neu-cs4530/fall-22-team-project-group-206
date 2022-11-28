import { Flex } from '@chakra-ui/react';
import React from 'react';
import PlayerController from '../../../../classes/PlayerController';
import OccupantModal from '../../Leaderboard/OccupantModal';
const MAX_OCCUPANTS_DISPLAY = 3;
export default function OccupantsDisplay(props: { players: PlayerController[] }): JSX.Element {
  // TODO: uncomment when multiplayer fixed
  //   useEffect(() => {
  //     setNumOccupants(props.players.length);
  //   }, [props.players]);

  return (
    <Flex>
      <OccupantModal name={props.players[0].userName} />
      {props.players[1] ? (
        <div className='shift'>
          <OccupantModal name={props.players[1].userName} />{' '}
        </div>
      ) : (
        <></>
      )}
      {props.players.length >= MAX_OCCUPANTS_DISPLAY ? (
        <>
          {props.players.length === MAX_OCCUPANTS_DISPLAY ? (
            <div className='shift2'>
              <OccupantModal name={props.players[2].userName} />{' '}
            </div>
          ) : (
            <div className='shift2'>
              <OccupantModal name={(props.players.length - MAX_OCCUPANTS_DISPLAY - 1).toString()} />{' '}
            </div>
          )}
        </>
      ) : (
        <></>
      )}
    </Flex>
  );
}
