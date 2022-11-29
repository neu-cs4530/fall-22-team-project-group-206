import { Box, ListItem, List, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ScoreModel } from '../../../types/CoveyTownSocket';
import LeaderboardModal from './ScoreModal';

const LEADERBOARD_SIZE = 5;
/**
 * List the scores for the player
 */
export default function Leaderboard(): JSX.Element {
  //TODO: dummy data will be removed once leaderboard api is all set
  const score1: ScoreModel = {
    teamName: 'short name',
    score: 100,
    teamMembers: ['very long member name', 'very long member name'],
    usedHint: true,
  };
  const score2: ScoreModel = {
    teamName: 'long team name',
    score: 10,
    teamMembers: ['sn1', 'sn2'],
    usedHint: false,
  };
  const score3: ScoreModel = {
    teamName: 'very very very long team name',
    score: 2,
    teamMembers: ['long name', 'long name1', 'long name2', 'long name3'],
    usedHint: true,
  };

  const [leaderboard, setLeaderboard] = useState<ScoreModel[]>([]);
  useEffect(() => {
    async function retrieveLeaderboard() {
      try {
        if (process.env.REACT_APP_TOWNS_SERVICE_URL !== undefined) {
          const url = process.env.REACT_APP_TOWNS_SERVICE_URL.concat('/scores/amount/').concat(
            LEADERBOARD_SIZE.toString(10),
          );
          const scoreResp = await axios.get(url);
          setLeaderboard(scoreResp.data.scores);
        }
      } catch (e) {
        throw new Error('Unable to set Leaderboard');
      }
    }
    retrieveLeaderboard();
  }, [leaderboard]);

  const leaderboardExample: ScoreModel[] = [score1, score2, score3];
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
