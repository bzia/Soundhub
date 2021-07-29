import './css/Sidebar.css';
import React, { useContext, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { Tooltip, useToast } from '@chakra-ui/react';
import ProfileModal from '../components/ProfileModal';

import styled from 'styled-components';
import { HeadphonesSoundWave } from '@styled-icons/fluentui-system-regular/HeadphonesSoundWave';
import { Home } from '@styled-icons/boxicons-regular/Home';
import { LineChart } from '@styled-icons/boxicons-regular/LineChart';
import SessionContext from '../context/SessionContext';
import MusicContext from '../context/MusicContext';

const Sidebar = () => {
  const toast = useToast();

  const {
    accessToken,
    addAccessToken,
    getSpotifyInfoAndLogFollowers,

    getFollowerInfo,

    loadSpotifyData,
  } = useContext(SessionContext);
  const {
    getUsersPlaylists,

    getReccomendedSongs,

    getExploreSongs,

    getTopArtistsAndGenres,
  } = useContext(MusicContext);
  const connectHandler = async () => {
    if (accessToken) {
      toast({
        position: 'top',
        title: 'Error',
        description: 'Already Connected to Spotify!',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    } else {
      window.location.href = 'https://soundhub-app.herokuapp.com/api/login';
    }
  };

  const getHashParams = () => {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  };

  /* I've used the sidebar component's useEffect (since its the only common component amongst 
    the other screens) to fire off all the API calls for the data we need */
  useEffect(() => {
    var params = getHashParams();
    if (!accessToken && params.access_token) {
      addAccessToken(params);

      toast({
        position: 'top',
        title: 'Success',
        description: 'Connected To Spotify!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    if (accessToken) {
      getUsersPlaylists();
      getReccomendedSongs();
      getExploreSongs();
      getTopArtistsAndGenres();
      getFollowerInfo();
      getSpotifyInfoAndLogFollowers();
      loadSpotifyData();
    }
  }, [accessToken]);

  const HeadphoneIcon = styled(HeadphonesSoundWave)`
    &:hover {
      color: #24192e;
    }
  `;
  const ChartIcon = styled(LineChart)`
    &:hover {
      color: #24192e;
    }
  `;
  const HomeIcon = styled(Home)`
    &:hover {
      color: #24192e;
    }
  `;

  return (
    <aside className='sidebar'>
      {!accessToken ? (
        <Link to='/dashboard' className='icons'>
          <Tooltip label='Home' placement='right'>
            <HomeIcon />
          </Tooltip>
        </Link>
      ) : (
        <></>
      )}

      <ProfileModal />

      <div className='icons' onClick={connectHandler}>
        <Tooltip label='Connect your Spotify' placement='right'>
          <i className='fab fa-spotify fa-2x'></i>
        </Tooltip>
      </div>

      <Link to='/player' className='icons'>
        <Tooltip label='Player' placement='right'>
          <HeadphoneIcon />
        </Tooltip>
      </Link>

      <Link to='/analytics' className='icons'>
        <Tooltip label='Analytics' placement='right'>
          <ChartIcon />
        </Tooltip>
      </Link>
    </aside>
  );
};

export default Sidebar;
