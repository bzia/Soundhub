import React, { useContext } from 'react';
import SessionContext from '../context/SessionContext';
import QueueContext from '../context/QueueContext';

import SpotifyPlayer from 'react-spotify-web-playback';

const Player = () => {
  const { accessToken } = useContext(SessionContext);
  const { trackURIs } = useContext(QueueContext);
  return (
    <div
      style={{
        marginTop: '2em',
        width: '100vw',
        bottom: '0',
        position: 'absolute',
      }}
    >
      <SpotifyPlayer
        token={accessToken}
        uris={trackURIs}
        styles={{
          height: '80px',
          bgColor: '#24192e',
          color: 'white',
          loaderColor: '#fffff',
          sliderColor: 'black',
          trackNameColor: 'white',
          sliderHandleColor: 'white',
          sliderHeight: 8,
        }}
        magnifySliderOnHover={true}
        showSaveIcon={true}
        style={{ alignSelf: 'flex-end' }}
      />
    </div>
  );
};

export default Player;
