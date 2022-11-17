import {
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
  Checkbox,
} from '@chakra-ui/react';
import React from 'react';

import { ScoreModel } from '../../types/CoveyTownSocket';
/**
 * Detail for scores
 */
export default function LeaderboardModel(props: {
  scoreModel: ScoreModel;
  open: boolean;
  close: () => void;
}): JSX.Element {
  return (
    <Modal isOpen={props.open} onClose={props.close}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{props.scoreModel.teamName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid h='200px' templateRows='repeat(2, 1fr)' templateColumns='repeat(5, 1fr)' gap={4}>
            <GridItem colSpan={2} rowSpan={1}>
              Team Memembers: {props.scoreModel.teamMembers.join(', ')}
            </GridItem>

            <GridItem colSpan={2} rowSpan={1}>
              <Checkbox isChecked={props.scoreModel.usedHint}>Used Hint</Checkbox>
            </GridItem>
          </Grid>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={props.close}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}