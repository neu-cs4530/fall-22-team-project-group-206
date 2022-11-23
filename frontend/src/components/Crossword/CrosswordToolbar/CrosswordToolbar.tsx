import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Spacer } from '@chakra-ui/react';
import React from 'react';

const TIMER_WIDTH = document.getElementById('crossword-grid')?.offsetWidth;

function CrosswordToolbar() {
  return (
    <Flex gap={'2'} paddingBottom={'12px'}>
      <Box p='2' bg='gray.200' width={TIMER_WIDTH} textAlign='center'>
        00:00
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
      <Spacer></Spacer>
      <Button p='4' colorScheme='blue' size='md'>
        Leaderboard
      </Button>
    </Flex>
  );
}

export default CrosswordToolbar;
