import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';
import { useCrosswordAreaPuzzleController, useInteractable } from '../../classes/TownController';
import useTownController from '../../hooks/useTownController';
import CrosswordClues from './CrosswordClues/CrosswordClues';
import './CrosswordGameModal.css';
import CrosswordGrid from './CrosswordGrid/CrosswordGrid';
import CrosswordPuzzleAreaInteractable from '../Town/interactables/CrosswordPuzzleArea';

function CrosswordGameModal(props: {
  crosswordPuzzleArea: CrosswordPuzzleAreaInteractable;
}): JSX.Element {
  const coveyTownController = useTownController();
  const crosswordPuzzleAreaController = useCrosswordAreaPuzzleController(
    props.crosswordPuzzleArea?.id,
  );

  const isOpen = crosswordPuzzleAreaController !== undefined;

  const closeModal = useCallback(() => {
    if (props.crosswordPuzzleArea) {
      coveyTownController.interactEnd(props.crosswordPuzzleArea);
    }
  }, [coveyTownController, props.crosswordPuzzleArea]);

  function onClose() {
    closeModal();
    coveyTownController.unPause();
  }

  useEffect(() => {
    if (crosswordPuzzleAreaController) {
      coveyTownController.pause();
    } else {
      coveyTownController.unPause();
    }
  }, [coveyTownController, crosswordPuzzleAreaController]);

  if (crosswordPuzzleAreaController.puzzle) {
    return (
      <Modal isOpen={isOpen} onClose={() => onClose()} size='6xl' isCentered>
        <ModalOverlay />
        <ModalContent padding='15px'>
          <ModalHeader>{crosswordPuzzleAreaController.puzzle.info.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack>
              <CrosswordGrid controller={crosswordPuzzleAreaController} />
              <CrosswordClues
                acrossClues={crosswordPuzzleAreaController.puzzle.clues.across}
                downClues={crosswordPuzzleAreaController.puzzle.clues.down}
              />
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  } else {
    return (
      <Modal isOpen={isOpen} onClose={() => onClose()} isCentered>
        <ModalOverlay />
        <ModalContent padding='15px'>
          <ModalHeader>Crossword Puzzle</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <span>Crossword Puzzle Missing</span>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
}

/**
 * The CrosswordPuzzleAreaWrapper is suitable to be *always* rendered inside of a town, and
 * will activate only if the player begins interacting with a crossword puzzle area.
 */
export default function CrosswordPuzzleAreaWrapper(): JSX.Element {
  const crosswordPuzzleArea =
    useInteractable<CrosswordPuzzleAreaInteractable>('crosswordPuzzleArea');
  console.log(crosswordPuzzleArea);
  if (crosswordPuzzleArea) {
    return <CrosswordGameModal crosswordPuzzleArea={crosswordPuzzleArea} />;
  }
  return <></>;
}
