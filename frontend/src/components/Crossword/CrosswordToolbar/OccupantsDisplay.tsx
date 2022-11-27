import { Flex } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import PlayerController from '../../../classes/PlayerController';
import PlayersInTownList from '../../SocialSidebar/PlayersList';
import OccupantModal from './OccupantModal';
/**
 * Detail for scores
 */
export default function OccupantsDisplay(props: { players: PlayerController[] }): JSX.Element {
  const [numOccupants, setNumOccupants] = useState<number>(2);
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
      {props.players.length >= 3 ? (
        <>
          {props.players.length === 3 ? (
            <div className='shift2'>
              <OccupantModal name={props.players[2].userName} />{' '}
            </div>
          ) : (
            <div className='shift2'>
              <OccupantModal name={(props.players.length - 2).toString()} />{' '}
            </div>
          )}
        </>
      ) : (
        <></>
      )}
    </Flex>
  );
}
