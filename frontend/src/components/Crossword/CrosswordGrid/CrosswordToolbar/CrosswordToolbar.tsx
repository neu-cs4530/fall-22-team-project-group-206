import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react';

import React, { useState, useEffect } from 'react';
import CrosswordPuzzleAreaController from '../../../../classes/CrosswordPuzzleAreaController';
import LeaderboardModal from '../../Leaderboard/LeaderboardModal';
import OccupantsDisplay from './OccupantsDisplay';
import Timer from './Timer';
import PlayerController from '../../../../classes/PlayerController';

const CELL_WIDTH = 28;

function CrosswordToolbar({
  controller,
  handleRebusProps,
  handleCheckProps,
}: {
  controller: CrosswordPuzzleAreaController;
  handleRebusProps: {
    isRebus: boolean;
    handleRebus: () => void;
  };
  handleCheckProps: {
    handleCheckCell: () => void;
    handleCheckWord: () => void;
    handleCheckPuzzle: () => void;
    handleRevealPuzzle: () => void;
  };
}) {
  const [occupants, setOccupants] = useState<PlayerController[]>(controller.occupants);

  const timerWidth = controller.puzzle?.grid.length
    ? controller.puzzle?.grid.length * CELL_WIDTH
    : 0;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [timerPaused, setTimerPaused] = useState<boolean>(controller.isGameOver);
  useEffect(() => {
    controller.addListener('gameOverChange', setTimerPaused);
    controller.addListener('occupantsChange', setOccupants);

    return () => {
      controller.removeListener('gameOverChange', setTimerPaused);
      controller.removeListener('occupantsChange', setOccupants);
    };
  }, [controller]);

  return (
    <Flex gap={'2'} paddingBottom={'12px'}>
      <Box p='2' bg='gray.200' width={timerWidth} textAlign='center'>
        <Timer
          startTime={controller.startTime ? controller.startTime : Date.now()}
          isPaused={timerPaused}
        />
      </Box>
      <Menu>
        <MenuButton p='4' as={Button} colorScheme='gray'>
          Check
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => handleCheckProps.handleCheckCell()}>Check letter</MenuItem>
          <MenuItem onClick={() => handleCheckProps.handleCheckWord()}>Check word</MenuItem>
          <MenuItem onClick={() => handleCheckProps.handleCheckPuzzle()}>Check puzzle</MenuItem>
          <MenuItem onClick={() => handleCheckProps.handleRevealPuzzle()}>Reveal</MenuItem>
        </MenuList>
      </Menu>
      <Button
        p='4'
        colorScheme={handleRebusProps.isRebus ? 'purple' : 'gray'}
        onClick={() => handleRebusProps.handleRebus()}>
        Rebus
      </Button>
      <OccupantsDisplay players={occupants} />

      <Spacer></Spacer>

      <Button p='4' colorScheme='blue' size='md' onClick={onOpen}>
        Leaderboard
      </Button>

      <LeaderboardModal onClose={onClose} isOpen={isOpen} />
    </Flex>
  );
}

export default CrosswordToolbar;
