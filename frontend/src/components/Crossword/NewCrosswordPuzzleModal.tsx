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
import { useInteractable } from '../../classes/TownController';
import { CrosswordPuzzleArea } from '../../generated/client';
import useTownController from '../../hooks/useTownController';

export default function NewCrosswordPuzzleModal(): JSX.Element {
  const coveyTownController = useTownController();
  const newCrosswordPuzzle = useInteractable('crosswordPuzzleArea');

  const [groupName, setGroupName] = useState<string>('');

  const isOpen = newCrosswordPuzzle !== undefined;

  useEffect(() => {
    if (newCrosswordPuzzle) {
      coveyTownController.pause();
    } else {
      coveyTownController.unPause();
    }
  }, [coveyTownController, newCrosswordPuzzle]);

  const closeModal = useCallback(() => {
    if (newCrosswordPuzzle) {
      coveyTownController.interactEnd(newCrosswordPuzzle);
    }
  }, [coveyTownController, newCrosswordPuzzle]);

  const toast = useToast();

  const createCrosswordPuzzle = useCallback(async () => {
    if (newCrosswordPuzzle) {
      const newCrosswordPuzzleToCreate: CrosswordPuzzleArea = {
        id: newCrosswordPuzzle.id,
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
  }, [groupName, coveyTownController, newCrosswordPuzzle, closeModal, toast]);

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
