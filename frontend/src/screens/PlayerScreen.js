import React, { useContext, useEffect } from 'react';
import './css/PlayerScreen.css';
import Sidebar from '../components/Sidebar';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from '@chakra-ui/react';
import Recommended from '../components/Recommended';

import { Spotify } from '@styled-icons/fa-brands/Spotify';
import Player from '../components/Player';
import MyPlaylists from '../components/MyPlaylists';
import Explore from '../components/Explore';
import SessionContext from '../context/SessionContext';
import { useHistory } from 'react-router-dom';

const PlayerScreen = (props) => {
  const history = useHistory();
  const { userInfo } = useContext(SessionContext);

  useEffect(() => {
    if (!userInfo) {
      history.push('/welcome');
    }
  });

  return (
    <div className='main-player'>
      <Sidebar />
      <div>
        <Box
          style={{
            height: '100vh',
            width: '100vw',
            position: 'relative',
          }}
          className='player-container'
          bgGradient='linear(to-r, #9756fc, pink.500)'
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              className='my-spotify-holder'
              style={{ width: '80%', marginTop: '5em', marginRight: '6em' }}
            >
              <div className='player-nav'>
                <div className='music-player-heading'>
                  <Spotify
                    style={{
                      width: '1.5em',
                      height: '1.5em',
                      display: 'inline',
                    }}
                  />
                  &nbsp; Stream Music
                </div>
              </div>
              <div className='my-spotify-view'>
                <div className='my-spotify' id='style-5'>
                  <Tabs style={{ color: 'white' }} variant='line' isFitted>
                    <TabList>
                      <Tab
                        style={{ fontSize: '1.4em', fontFamily: 'system-ui' }}
                        _selected={{ color: 'white', bg: '#9756fc' }}
                        _active={{ color: 'white', bg: '#9756fc' }}
                      >
                        Explore
                      </Tab>
                      <Tab
                        style={{ fontSize: '1.4em', fontFamily: 'system-ui' }}
                        _selected={{ color: 'white', bg: '#9756fc' }}
                        _active={{ color: 'white', bg: '#9756fc' }}
                      >
                        Recommended
                      </Tab>
                      <Tab
                        style={{ fontSize: '1.4em', fontFamily: 'system-ui' }}
                        _selected={{ color: 'white', bg: '#9756fc' }}
                        _active={{ color: 'white', bg: '#9756fc' }}
                      >
                        My Playlists
                      </Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <Explore />
                      </TabPanel>
                      <TabPanel>
                        <Recommended />
                      </TabPanel>
                      <TabPanel>
                        <MyPlaylists />
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>

          <Player />
        </Box>
      </div>
    </div>
  );
};

export default PlayerScreen;
