import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import React from 'react';
import Leaderboard from './Leaderboard';
/**
 * Leaderboard Pop up
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
