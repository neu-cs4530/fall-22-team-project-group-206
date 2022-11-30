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
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useCrosswordAreaPuzzleController } from '../../../../classes/TownController';
import { CrosswordPuzzleArea as CrosswordPuzzleAreaModel } from '../../../../generated/client';
import useTownController from '../../../../hooks/useTownController';
import { TeamNameInUseResponse } from '../../../../types/CoveyTownSocket';
import CrosswordPuzzleArea from '../CrosswordPuzzleArea';

/*
 Modal to select new group name and start new crossword.
 */
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
    close();
  }, [close]);

  const toast = useToast();

  const createCrosswordPuzzle = useCallback(async () => {
    let teamNameInvalid = true;
    if (groupName && crosswordPuzzleController) {
      let url = '';
      try {
        if (process.env.REACT_APP_TOWNS_SERVICE_URL !== undefined) {
          url = process.env.REACT_APP_TOWNS_SERVICE_URL.concat('/scores/teams/').concat(groupName);
        }
        if (process.env.PORT !== undefined) {
          url = process.env.PORT.concat('/scores/teams/').concat(groupName);
        }
        const isTeamNameAvailable: TeamNameInUseResponse = await axios.get(url);
        if (isTeamNameAvailable.data.inUse !== undefined) {
          teamNameInvalid = isTeamNameAvailable.data.inUse;
        } else {
          throw new Error(isTeamNameAvailable.data.errorMessage);
        }
      } catch (e) {
        if (e instanceof Error) {
          toast({
            title: 'Unable to check validity of team name',
            status: 'error',
            description: e.toString(),
          });
        }
      }
      if (teamNameInvalid) {
        toast({
          title: 'Team name already in use; Please select a different name',
          status: 'error',
        });
      } else {
        const newCrosswordPuzzleToCreate: CrosswordPuzzleAreaModel = {
          id: crosswordPuzzleArea.id,
          groupName: groupName,
          occupantsByID: [],
          isGameOver: false,
          startTime: Date.now(),
        };
        try {
          await coveyTownController.createCrosswordPuzzleArea(newCrosswordPuzzleToCreate);
          toast({
            title: 'Crossword Created!',
            status: 'success',
          });
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
