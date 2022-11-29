import { Box } from '@chakra-ui/react';
import React from 'react';
import './OccupantDisplay.css';

export default function OccupantModal(props: { name: string }): JSX.Element {
  return (
    <Box className='display' bg='gray.200' textAlign={'center'}>
      <div className='text'>{props.name.substring(0, 1).toUpperCase()}</div>
    </Box>
  );
}
