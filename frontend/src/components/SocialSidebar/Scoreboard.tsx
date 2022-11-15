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
} from '@chakra-ui/react';
import React from 'react';

import { ScoreModel } from '../../types/CoveyTownSocket';
/**
 * Lists the current players in the town, along with the current town's name and ID
 *
 * See relevant hooks: `usePlayersInTown` and `useCoveyAppState`
 *
 */
export default function Scoreboard(): JSX.Element {
  const score1: ScoreModel = {
    teamName: 'team1',
    date: '1.1',
    score: 100,
    teamMembers: ['a123132131321', '3123123123213', '123123312'],
    usedHint: true,
    completed: true,
  };
  const score2: ScoreModel = {
    teamName: 'team2',
    date: '1.1',
    score: 100,
    teamMembers: ['a1', 'a2', 'a3'],
    usedHint: true,
    completed: true,
  };
  const score3: ScoreModel = {
    teamName: 'team3',
    date: '1.1',
    score: 29,
    teamMembers: ['a1', 'a2', 'a3'],
    usedHint: true,
    completed: true,
  };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const LeaderboardExample: ScoreModel[] = [score1, score2, score3];
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Heading as='h2' fontSize='l'>
        Crossword Leaderboard:
      </Heading>
      <div>
        <Grid templateColumns='repeat(5, 1fr)' gap={4}>
          <GridItem colSpan={2} h='5'>
            Team name
          </GridItem>
          <GridItem colStart={4} colEnd={6} h='10'>
            Score
          </GridItem>
        </Grid>
      </div>
      <OrderedList margin='3px'>
        {LeaderboardExample.map(score => (
          <ListItem key={score.teamName} margin='4px'>
            <Button onClick={onOpen} width='100%'>
              <Grid templateColumns='repeat(5, 1fr)' gap={6}>
                <GridItem colSpan={2} h='5'>
                  {score.teamName}
                </GridItem>
                <GridItem colStart={4} colEnd={6} h='10'>
                  {score.score}
                </GridItem>
              </Grid>
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{score.teamName}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Grid
                    h='200px'
                    templateRows='repeat(2, 1fr)'
                    templateColumns='repeat(5, 1fr)'
                    gap={4}>
                    <GridItem colSpan={2} rowSpan={1}>
                      Team Memembers: {score.teamMembers.map(member => member + ',')}
                    </GridItem>
                    <GridItem colSpan={2} rowSpan={1}>
                      Date: {score.date}
                    </GridItem>
                    <GridItem colSpan={2} rowSpan={1}>
                      Complete: {score.completed}
                    </GridItem>
                    <GridItem colSpan={2} rowSpan={1}>
                      Hint: {score.usedHint}
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
          </ListItem>
        ))}
      </OrderedList>
    </Box>
  );
}
