import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useCrosswordAreaPuzzleController } from '../../classes/TownController';
import { CrosswordPuzzleArea as CrosswordPuzzleAreaModel } from '../../generated/client';
import useTownController from '../../hooks/useTownController';
import CrosswordPuzzleArea from '../Town/interactables/CrosswordPuzzleArea';

export default function NewCrosswordPuzzleModal({
  isOpen,
  close,
  crosswordPuzzleArea,
}: {
  isOpen: boolean;
  close: () => void;
  crosswordPuzzleArea: CrosswordPuzzleArea;
}): JSX.Element {
  const coveyTownController = useTownController();
  const crosswordPuzzleController = useCrosswordAreaPuzzleController(crosswordPuzzleArea.id);

  const [groupName, setGroupName] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      coveyTownController.pause();
    } else {
      coveyTownController.unPause();
    }
  }, [coveyTownController, isOpen]);

  const closeModal = useCallback(() => {
    coveyTownController.unPause();
    close();
  }, [coveyTownController, close]);

  const toast = useToast();

  const createCrosswordPuzzle = useCallback(async () => {
    if (groupName && crosswordPuzzleController) {
      const newCrosswordPuzzleToCreate: CrosswordPuzzleAreaModel = {
        id: crosswordPuzzleArea.id,
        groupName: groupName,
        occupantsByID: [],
        isGameOver: false,
      };
      try {
        await coveyTownController.createCrosswordPuzzleArea(newCrosswordPuzzleToCreate);
        toast({
          title: 'Crossword Created!',
          status: 'success',
        });
        coveyTownController.unPause();
        closeModal();
      } catch (err) {
        if (err instanceof Error) {
          toast({
            title: 'Unable to create crossword puzzle',
            description: err.toString(),
            status: 'error',
          });
        } else {
          console.trace(err);
          toast({
            title: 'Unexpected Error',
            status: 'error',
          });
        }
      }
    }
  }, [
    crosswordPuzzleArea,
    groupName,
    coveyTownController,
    crosswordPuzzleController,
    closeModal,
    toast,
  ]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        closeModal();
        coveyTownController.unPause();
      }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Start a new crossword? </ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={ev => {
            ev.preventDefault();
            createCrosswordPuzzle();
          }}>
          <ModalBody pb={6}>
            <FormControl>
              <FormControl>
                <FormLabel htmlFor='groupName'>Group Name</FormLabel>
                <Input
                  id='groupName'
                  name='groupName'
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                />
              </FormControl>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={createCrosswordPuzzle}>
              Start
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}