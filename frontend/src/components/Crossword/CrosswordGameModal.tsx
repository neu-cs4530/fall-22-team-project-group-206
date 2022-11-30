import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import {
  useCrosswordAreaPuzzleController,
  useInteractable,
} from '../../classes/TownController';
import useTownController from '../../hooks/useTownController';
import CrosswordPuzzleAreaInteractable from '../Town/interactables/CrosswordPuzzleArea';
import './CrosswordGameModal.css';
import CrosswordPuzzleGame from './CrosswordPuzzleGame/CrosswordPuzzleGame';
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

    if (crosswordPuzzleAreaController) {
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
            <ModalHeader>
              <Flex>
                <div>{crosswordPuzzleAreaController.puzzle.info.title}</div>
                <IconButton
                  icon={<InfoOutlineIcon />}
                  aria-label='Help'
                  variant='unstyled'
                  marginLeft='10px'
                  colorScheme='gray'
                  onClick={() =>
                    window.open(
                      'https://www.nytimes.com/guides/crosswords/how-to-solve-a-crossword-puzzle',
                      '_blank',
                    )
                  }
                />
              </Flex>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <CrosswordPuzzleGame controller={crosswordPuzzleAreaController} />
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
  const crosswordPuzzleArea = useInteractable<CrosswordPuzzleAreaInteractable>(
    'crosswordPuzzleArea',
  );
  if (crosswordPuzzleArea) {
    return <CrosswordGameModal crosswordPuzzleArea={crosswordPuzzleArea} />;
  }
  return <></>;
}
