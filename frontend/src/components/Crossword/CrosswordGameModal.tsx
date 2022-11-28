import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useCrosswordAreaPuzzleController, useInteractable } from '../../classes/TownController';
import useTownController from '../../hooks/useTownController';
import CrosswordPuzzleAreaInteractable from '../Town/interactables/CrosswordPuzzleArea';
import './CrosswordGameModal.css';
import CrosswordGrid from './CrosswordGrid/CrosswordGrid';
import NewCrosswordPuzzleModal from './NewCrosswordPuzzleModal';

function CrosswordGameModal({
  crosswordPuzzleArea,
}: {
  crosswordPuzzleArea: CrosswordPuzzleAreaInteractable;
}): JSX.Element {
  const coveyTownController = useTownController();
  const crosswordPuzzleAreaController = useCrosswordAreaPuzzleController(crosswordPuzzleArea.id);
  const [selectIsOpen, setSelectIsOpen] = useState(
    crosswordPuzzleAreaController.groupName === undefined,
  );
  const [groupName, setGroupName] = useState(crosswordPuzzleAreaController.groupName);

  useEffect(() => {
    const setGroup = (name: string | undefined) => {
      if (!name) {
        coveyTownController.interactableEmitter.emit(
          'endIteraction',
          crosswordPuzzleAreaController,
        );
      } else {
        setGroupName(name);
      }
    };
    crosswordPuzzleAreaController.addListener('groupNameChange', setGroup);

    if (crosswordPuzzleAreaController.puzzle) {
      coveyTownController.pause();
    } else {
      coveyTownController.unPause();
    }

    return () => {
      crosswordPuzzleAreaController.removeListener('groupNameChange', setGroup);
    };
  }, [coveyTownController, crosswordPuzzleAreaController]);

  const isOpen = crosswordPuzzleAreaController.puzzle !== undefined;

  const closeModal = useCallback(() => {
    if (crosswordPuzzleArea) {
      coveyTownController.interactEnd(crosswordPuzzleArea);
    }
  }, [coveyTownController, crosswordPuzzleArea]);

  function onClose() {
    closeModal();
    coveyTownController.unPause();
  }

  if (!groupName) {
    return (
      <NewCrosswordPuzzleModal
        isOpen={selectIsOpen}
        close={() => {
          setSelectIsOpen(false);
          coveyTownController.unPause();
        }}
        crosswordPuzzleArea={crosswordPuzzleArea}
      />
    );
  } else {
    if (crosswordPuzzleAreaController.puzzle) {
      return (
        <Modal isOpen={isOpen} onClose={() => onClose()} size='6xl' isCentered>
          <ModalOverlay />
          <ModalContent padding='15px'>
            <ModalHeader>{crosswordPuzzleAreaController.puzzle.info.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <CrosswordGrid controller={crosswordPuzzleAreaController} />
            </ModalBody>
          </ModalContent>
        </Modal>
      );
    } else {
      return (
        <Modal isOpen={isOpen} onClose={() => onClose()} size='6xl' isCentered>
          <ModalOverlay />
          <ModalContent padding='15px'>
            <ModalHeader>Uh oh...</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{`Crossword Missing :(`}</ModalBody>
          </ModalContent>
        </Modal>
      );
    }
  }
}

/**
 * The CrosswordPuzzleAreaWrapper is suitable to be *always* rendered inside of a town, and
 * will activate only if the player begins interacting with a crossword puzzle area.
 */
export default function CrosswordPuzzleAreaWrapper(): JSX.Element {
  const crosswordPuzzleArea =
    useInteractable<CrosswordPuzzleAreaInteractable>('crosswordPuzzleArea');
  if (crosswordPuzzleArea) {
    return <CrosswordGameModal crosswordPuzzleArea={crosswordPuzzleArea} />;
  }
  return <></>;
}
