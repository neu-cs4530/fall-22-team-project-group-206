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
import React from 'react';
import LeaderboardModal from './LeaderboardModal';
import Timer from './Timer';
import CrosswordPuzzleAreaController, {
  useCrosswordPuzzleAreaOccupants,
} from '../../../classes/CrosswordPuzzleAreaController';
import OccupantsDisplay from './OccupantsDisplay';
import { PlayerLocation } from '../../../../../shared/types/CoveyTownSocket';
import PlayerController from '../../../classes/PlayerController';
import { nanoid } from 'nanoid';

const CELL_WIDTH = 28;

function CrosswordToolbar({ controller }: { controller: CrosswordPuzzleAreaController }) {
  // TODO: uncomment when multiplayer is fixed
  // const occupants = useCrosswordPuzzleAreaOccupants(controller);
  const playerLocation: PlayerLocation = {
    moving: false,
    x: 0,
    y: 0,
    rotation: 'front',
  };
  const occupants = [
    new PlayerController(nanoid(), nanoid(), playerLocation),
    new PlayerController(nanoid(), nanoid(), playerLocation),
    new PlayerController(nanoid(), nanoid(), playerLocation),
    new PlayerController(nanoid(), nanoid(), playerLocation),
    new PlayerController(nanoid(), nanoid(), playerLocation),
  ];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const timerWidth = controller.puzzle?.grid.length
    ? controller.puzzle?.grid.length * CELL_WIDTH
    : 0;
  return (
    <Flex gap={'2'} paddingBottom={'12px'}>
      <Box p='2' bg='gray.200' width={timerWidth} textAlign='center'>
        <Timer />
      </Box>
      <Menu>
        <MenuButton p='4' as={Button} colorScheme='gray'>
          Check
        </MenuButton>
        <MenuList>
          <MenuItem>Check letter</MenuItem>
          <MenuItem>Check word</MenuItem>
          <MenuItem>Check puzzle</MenuItem>
          <MenuItem>Reveal</MenuItem>
        </MenuList>
      </Menu>
      <Button p='4' colorScheme='gray'>
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
