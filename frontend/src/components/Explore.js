import React, { useContext } from 'react';

import { Table, Thead, Tbody, Tr, Th, TableCaption } from '@chakra-ui/react';

import SongItem from './SongItem';
import MusicContext from '../context/MusicContext';
import { ConvertMsToMinutes } from '../utils';

const Explore = () => {
  const { exploreSongs } = useContext(MusicContext);

  return (
    <div>
      <Table variant='unstyled'>
        <TableCaption>
          {exploreSongs.length > 0 ? (
            <span>Top New Released Singles</span>
          ) : (
            <span>Link your spotify to browse spotify's new releases!</span>
          )}
        </TableCaption>
        <Thead>
          <Tr style={{ borderBottom: '1px solid rgba(79, 67, 67, 0.9)' }}>
            <Th>Artist & Song</Th>
            <Th>Album</Th>
            <Th>Duration</Th>
          </Tr>
        </Thead>
        <Tbody>
          {exploreSongs.map((song) => (
            <SongItem
              key={song.spotify_id}
              artist={song.artist}
              title={song.title}
              cover={song.cover}
              albumName={song.albumName}
              duration={ConvertMsToMinutes(song.duration)}
              spotify_id={song.spotify_id}
            />
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default Explore;
