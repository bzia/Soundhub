import React, { useContext } from 'react';
import PlaylistItem from './PlaylistItem';
import './css/MyPlaylists.css';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Table, Thead, Tbody, Tr, Th, TableCaption } from '@chakra-ui/react';
import MusicContext from '../context/MusicContext';

import SongItem from './SongItem';
import { ConvertMsToMinutes } from '../utils';
const MyPlaylists = () => {
  const {
    activePlaylist,
    isPlaylistActive,

    togglePlaylistView,
    playlists,
    removeActivePlaylist,
  } = useContext(MusicContext);

  return (
    <div>
      {isPlaylistActive ? (
        <div>
          <div>
            <div className='selected-playlist-title'>
              <ArrowBackIcon
                onClick={() => {
                  togglePlaylistView();
                  removeActivePlaylist();
                }}
              />
              &nbsp; <span>{activePlaylist['name']}</span>
            </div>
          </div>
          <Table variant='unstyled'>
            <TableCaption>
              Songs collected from various top artists
            </TableCaption>
            <Thead>
              <Tr style={{ borderBottom: '1px solid rgba(79, 67, 67, 0.9)' }}>
                <Th>Artist & Song</Th>
                <Th>Album</Th>
                <Th>Duration</Th>
              </Tr>
            </Thead>
            <Tbody>
              {activePlaylist['tracks'].map((track) => (
                <SongItem
                  artist={track['track']['artists'][0]['name']}
                  title={track['track']['name']}
                  cover={track['track']['album']['images'][2]['url']}
                  albumName={track['track']['album']['name']}
                  duration={ConvertMsToMinutes(track['track']['duration_ms'])}
                  spotify_id={track['track']['uri']}
                  queue={false}
                />
              ))}
            </Tbody>
          </Table>
        </div>
      ) : (
        <div className='playlist-container'>
          {playlists.length > 0 ? (
            playlists.map((playlist) => (
              <PlaylistItem
                key={playlist['id']}
                name={playlist['name']}
                owner={playlist['owner']}
                id={playlist['id']}
                cover={playlist['cover']}
                tracks={playlist['tracks']}
                obj={playlist}
              />
            ))
          ) : (
            <span>Link your spotify to see your playlists!</span>
          )}
        </div>
      )}
    </div>
  );
};

export default MyPlaylists;
