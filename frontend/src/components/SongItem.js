import React, { useContext } from 'react';
import './css/SongItem.css';
import { Tooltip, Tr, Td, useToast } from '@chakra-ui/react';
import { CloseIcon, AddIcon, TimeIcon } from '@chakra-ui/icons';
import QueueContext from '../context/QueueContext';

const SongItem = (props) => {
  const { trackURIs, addToTrackURIs } = useContext(QueueContext);
  const toast = useToast();
  return (
    <Tr style={{ borderBottom: '1px solid rgba(79, 67, 67, 0.4)' }}>
      <Td style={{ paddingLeft: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {props.queue ? (
            <Tooltip label='Remove from Queue' placement='left'>
              <CloseIcon style={{ marginRight: '1em' }} />
            </Tooltip>
          ) : (
            <Tooltip label='Add to Queue' placement='left'>
              <AddIcon
                className='add-icon'
                onClick={() => {
                  addToTrackURIs(props.spotify_id);
                  toast({
                    position: 'top',
                    description: 'Added Track to your Queue',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                }}
              />
            </Tooltip>
          )}

          <img
            src={props.cover}
            style={{ marginRight: '1em', minWidth: 80, minHeight: 80 }}
          ></img>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>{props.title}</span>
            <span style={{ color: 'grey' }}>{props.artist}</span>
          </div>
        </div>
      </Td>
      <Td>
        <span style={{ color: 'grey' }}>{props.albumName}</span>
      </Td>
      <Td>
        <div>
          <TimeIcon />
          <span style={{ color: 'grey', marginLeft: '0.5em' }}>
            {props.duration}
          </span>
        </div>
      </Td>
    </Tr>
  );
};

export default SongItem;
