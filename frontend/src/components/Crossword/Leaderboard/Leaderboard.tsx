import { Box, ListItem, List, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';

import { ScoreModel } from '../../../types/CoveyTownSocket';
import LeaderboardModal from './ScoreModal';
/**
 * List the scores for the player
 */
export default function Leaderboard(): JSX.Element {
  const leaderboardExample: ScoreModel[] = [];
  const [detailIndex, setDetailIndex] = useState<number>(0);
  const { onOpen, isOpen, onClose } = useDisclosure();

  const openDialog = (index: number) => {
    setDetailIndex(index);
    onOpen();
  };

  const orderedListView = leaderboardExample.map(score => (
    <ListItem
      key={score.teamName}
      onClick={() => openDialog(leaderboardExample.indexOf(score))}
      backgroundColor='gray.100'
      borderRadius={10}
      margin='4px'
      padding='8px'
      maxWidth='500px'>
      <Grid templateColumns='repeat(5, 1fr)' gap={6}>
        <GridItem colSpan={1} h='5' width='100%'>
          {leaderboardExample.indexOf(score) + 1}
        </GridItem>
        <GridItem
          colStart={2}
          colEnd={5}
          h='5'
          width='100%'
          whiteSpace='nowrap'
          overflow='hidden'
          textOverflow='----'>
          {score.teamName}
        </GridItem>

        {score.score}
      </Grid>
    </ListItem>
  ));

  return (
    <Box>
      <div>
        <Grid templateColumns='repeat(5, 1fr)' gap={3}>
          <GridItem colSpan={1} h='5'>
            Rank
          </GridItem>
          <GridItem colSpan={3} h='5'>
            Team name
          </GridItem>
          <GridItem colStart={5} colEnd={6} h='10'>
            Time
          </GridItem>
        </Grid>
      </div>
      <List margin='3px'>
        {leaderboardExample.length != 0 ? orderedListView : <div>Leaderboard Empty</div>}
      </List>
      {leaderboardExample.length != 0 ? (
        <LeaderboardModal
          scoreModel={leaderboardExample[detailIndex]}
          open={isOpen}
          close={onClose}
        />
      ) : (
        <></>
      )}
    </Box>
  );
}
