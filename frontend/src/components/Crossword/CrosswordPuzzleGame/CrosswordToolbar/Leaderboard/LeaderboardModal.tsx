import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
import Leaderboard from './Leaderboard';
/**
 * Detail for scores
 */
export default function LeaderboardModal(props: {
  onClose: () => void;
  isOpen: boolean;
}): JSX.Element {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent padding='10px'>
        <ModalHeader>Crossword Leaderboard</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Leaderboard />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
