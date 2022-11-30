import { Box, ListItem, List, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ScoreModel } from '../../../types/CoveyTownSocket';
import LeaderboardModal from './ScoreModal';

const LEADERBOARD_SIZE = 5;
/**
 * List the scores for the players
 */
export default function Leaderboard(): JSX.Element {
  const [leaderboard, setLeaderboard] = useState<ScoreModel[]>([]);
  useEffect(() => {
    async function retrieveLeaderboard() {
      try {
        let url = '';
        if (process.env.REACT_APP_TOWNS_SERVICE_URL !== undefined) {
          url = process.env.REACT_APP_TOWNS_SERVICE_URL.concat('/scores/amount/').concat(
            LEADERBOARD_SIZE.toString(10),
          );
        }
        if (process.env.PORT !== undefined) {
          url = process.env.PORT.concat('/scores/amount/').concat(LEADERBOARD_SIZE.toString(10));
        }
        const scoreResp = await axios.get(url);
        setLeaderboard(scoreResp.data.scores);
      } catch (e) {
        throw new Error('Unable to set Leaderboard');
      }
    }
    retrieveLeaderboard();
  }, [leaderboard]);

  const [detailIndex, setDetailIndex] = useState<number>(0);
  const { onOpen, isOpen, onClose } = useDisclosure();

  const openDialog = (index: number) => {
    setDetailIndex(index);
    onOpen();
  };

  const orderedListView = leaderboard.map(score => (
    <ListItem
      key={score.teamName}
      onClick={() => openDialog(leaderboard.indexOf(score))}
      backgroundColor='gray.100'
      borderRadius={10}
      margin='4px'
      padding='8px'
      maxWidth='500px'>
      <Grid templateColumns='repeat(5, 1fr)' gap={6}>
        <GridItem colSpan={1} h='5' width='100%'>
          {leaderboard.indexOf(score) + 1}
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
        {leaderboard.length != 0 ? orderedListView : <div>Leaderboard Empty</div>}
      </List>
      {leaderboard.length != 0 ? (
        <LeaderboardModal scoreModel={leaderboard[detailIndex]} open={isOpen} close={onClose} />
      ) : (
        <></>
      )}
      <List margin='3px'>
        {leaderboard.length != 0 ? orderedListView : <div>Leaderboard Empty</div>}
      </List>
      {leaderboard.length != 0 ? (
        <LeaderboardModal scoreModel={leaderboard[detailIndex]} open={isOpen} close={onClose} />
      ) : (
        <></>
      )}
    </Box>
  );
}
