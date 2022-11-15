import {
  Box,
  Heading,
  ListItem,
  OrderedList,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Checkbox,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { ScoreModel } from '../../types/CoveyTownSocket';
/**
 * Lists the current players in the town, along with the current town's name and ID
 *
 * See relevant hooks: `usePlayersInTown` and `useCoveyAppState`
 *
 */
export default function Scoreboard(): JSX.Element {
  //dummy data will be removed once leaderboard api is all set
  const score1: ScoreModel = {
    teamName: 'short name',
    date: '1.1',
    score: 100,
    teamMembers: ['very long member name', 'very long member name'],
    usedHint: true,
    completed: true,
  };
  const score2: ScoreModel = {
    teamName: 'long team name',
    date: '1.2',
    score: 10,
    teamMembers: ['sn1', 'sn2'],
    usedHint: false,
    completed: true,
  };
  const score3: ScoreModel = {
    teamName: 'very very very long team name',
    date: '1.3',
    score: 2,
    teamMembers: ['long name', 'long name1', 'long name2', 'long name3'],
    usedHint: true,
    completed: true,
  };

  const leaderboardExample: ScoreModel[] = [score1, score2, score3];
  const [detailIndex, setDetailIndex] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openDialog = (index: number) => {
    setDetailIndex(index);
    onOpen();
  };
  return (
    <Box>
      <Heading as='h2' fontSize='l'>
        Crossword Leaderboard:
      </Heading>
      <div>
        <Grid templateColumns='repeat(5, 1fr)' gap={3}>
          <GridItem colSpan={1} h='5'>
            Rank
          </GridItem>
          <GridItem colSpan={3} h='5'>
            Team name
          </GridItem>
          <GridItem colStart={5} colEnd={6} h='10'>
            Score
          </GridItem>
        </Grid>
      </div>
      <OrderedList margin='3px'>
        {leaderboardExample.map(score => (
          <ListItem
            key={score.teamName}
            onClick={() => openDialog(leaderboardExample.indexOf(score))}
            backgroundColor='gray.100'
            borderRadius={10}
            margin='4px'
            padding='8px'>
            <Grid templateColumns='repeat(5, 1fr)' gap={6}>
              <GridItem colSpan={1} h='5' width='100%'>
                {leaderboardExample.indexOf(score)}
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
        ))}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{leaderboardExample[detailIndex].teamName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid
                h='200px'
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(5, 1fr)'
                gap={4}>
                <GridItem colSpan={2} rowSpan={1}>
                  Team Memembers: {leaderboardExample[detailIndex].teamMembers.join(', ')}
                </GridItem>
                <GridItem colSpan={2} rowSpan={1}>
                  Date: {leaderboardExample[detailIndex].date}
                </GridItem>
                <GridItem colSpan={2} rowSpan={1}>
                  <Checkbox isChecked={leaderboardExample[detailIndex].completed}>
                    Complete
                  </Checkbox>
                </GridItem>
                <GridItem colSpan={2} rowSpan={1}>
                  <Checkbox isChecked={leaderboardExample[detailIndex].usedHint}>Hint Use</Checkbox>
                </GridItem>
              </Grid>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </OrderedList>
    </Box>
  );
}
