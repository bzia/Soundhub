import { BrowserRouter as Router, Route } from 'react-router-dom';
import React, { useState } from 'react';
import LandingScreen from './screens/LandingScreen';
import DashboardScreen from './screens/DashboardScreen';
import PlayerScreen from './screens/PlayerScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import { ChakraProvider } from '@chakra-ui/react';
import QueueContext from './context/QueueContext';
import MusicContext from './context/MusicContext';
import SessionContext from './context/SessionContext';

import axios from 'axios';

function App() {
  /*---------------------------- User Info Functions  ----------------------------*/

  const [userInfo, changeUserInfo] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const setUserInfo = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
    changeUserInfo(JSON.parse(localStorage.getItem('userInfo')));
  };

  const removeUserInfo = () => {
    localStorage.removeItem('userInfo');
    changeUserInfo(null);
  };

  /*---------------------------- Access Token Functions  ----------------------------*/

  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('accessToken')
      ? localStorage.getItem('accessToken')
      : null
  );

  const addAccessToken = (params) => {
    localStorage.setItem('accessToken', params.access_token);
    setAccessToken(localStorage.getItem('accessToken'));
  };

  const removeAccessToken = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
  };

  /*---------------------------- Spotify Connection Status Functions  ----------------------------*/

  const [loadedSpotifyData, setLoadedSpotifyData] = useState(
    localStorage.getItem('loadedSpotifyData')
      ? localStorage.getItem('loadedSpotifyData')
      : false
  );

  const loadSpotifyData = () => {
    localStorage.setItem('loadedSpotifyData', true);
    setLoadedSpotifyData(JSON.parse(localStorage.getItem('loadedSpotifyData')));
  };

  const unloadSpotifyData = () => {
    localStorage.removeItem('loadedSpotifyData', false);
    setLoadedSpotifyData(JSON.parse(localStorage.getItem('loadedSpotifyData')));
  };

  /*---------------------------- Spotify Info + Followers Functions  ----------------------------*/

  const [spotifyInfo, changeSpotifyInfo] = useState(
    localStorage.getItem('spotifyInfo')
      ? JSON.parse(localStorage.getItem('spotifyInfo'))
      : {}
  );

  const getSpotifyInfoAndLogFollowers = async () => {
    if (!loadedSpotifyData) {
      const { data } = await axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      localStorage.setItem('spotifyInfo', JSON.stringify(data));

      changeSpotifyInfo(data);

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      let user_id = userInfo['id'];
      let followers = data['followers']['total'];

      await axios.post('/api/users/followers', { user_id, followers }, config);
    }
  };

  const removeSpotifyInfo = () => {
    localStorage.removeItem('spotifyInfo');
    changeSpotifyInfo({});
  };

  /*---------------------------- Spotify Follower Data Functions  ----------------------------*/

  const [followerInfo, setFollowerInfo] = useState(
    localStorage.getItem('followerInfo')
      ? JSON.parse(localStorage.getItem('followerInfo'))
      : {}
  );

  const removeFollowerInfo = () => {
    localStorage.removeItem('followerInfo');
    setFollowerInfo({});
  };

  const getFollowerInfo = async () => {
    if (!loadedSpotifyData) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      let user_id = userInfo['id'];
      const { data } = await axios.get(
        `/api/users/followers/${user_id}`,
        config
      );

      localStorage.setItem('followerInfo', JSON.stringify(data));
      setFollowerInfo(data);
    }
  };

  /*---------------------------- Top Genre + Artists Functions  ----------------------------*/

  const [topArtistsAndGenres, setTopArtistsAndGenres] = useState(
    localStorage.getItem('topArtistsAndGenres')
      ? JSON.parse(localStorage.getItem('topArtistsAndGenres'))
      : []
  );

  const removeTopArtistsAndGenres = async () => {
    localStorage.removeItem('topArtistsAndGenres');
    setTopArtistsAndGenres([]);
  };

  const getTopArtistsAndGenres = async () => {
    if (!loadedSpotifyData) {
      const { data } = await axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/top/artists/',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      let genres = [];

      for (let i = 0; i < data['items'].length; i++) {
        for (let x = 0; x < data['items'][i]['genres'].length; x++) {
          genres.push(data['items'][i]['genres'][x]);
        }
      }

      data['genres'] = genres;
      localStorage.setItem('topArtistsAndGenres', JSON.stringify(data));
      setTopArtistsAndGenres(data);
    }
  };

  /*---------------------------- Playlist Functions ----------------------------*/

  const [activePlaylist, changeActivePlaylist] = useState(null);

  const [isPlaylistActive, showPlaylistView] = useState(false);

  const loadActivePlaylist = (playlist) => {
    changeActivePlaylist(playlist);
  };
  const removeActivePlaylist = () => {
    changeActivePlaylist(null);
  };
  const togglePlaylistView = () => {
    if (isPlaylistActive === true) {
      showPlaylistView(false);
    } else {
      showPlaylistView(true);
    }
  };

  const [playlists, setPlaylists] = useState(
    localStorage.getItem('playlists')
      ? JSON.parse(localStorage.getItem('playlists'))
      : []
  );

  const addToPlaylists = (id, name, owner, tracks, cover) => {
    setPlaylists((prevState) => [
      ...prevState,
      {
        id: id,
        name: name,
        owner: owner,
        tracks: tracks,
        cover: cover,
      },
    ]);
  };

  const removePlaylists = () => {
    localStorage.removeItem('playlists');
    setPlaylists([]);
  };

  const getUsersPlaylists = async () => {
    if (!loadedSpotifyData) {
      if (playlists.length < 1) {
        const { data } = await axios({
          method: 'GET',
          url: 'https://api.spotify.com/v1/me/playlists',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // create array which we'll push promises onto (and later resolve all at once)
        let promises = [];

        for (let i = 0; i < data['items'].length; i++) {
          promises.push(
            axios({
              method: 'GET',
              url: `https://api.spotify.com/v1/playlists/${data['items'][i]['id']}/tracks?market=US`,
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            })
          );
        }

        let localPlaylists = [];

        // Resolve all promises into a single array of values containing track objects
        Promise.all(promises).then((values) => {
          for (let i = 0; i < data['items'].length; i++) {
            addToPlaylists(
              data['items'][i]['id'],
              data['items'][i]['name'],
              data['items'][i]['owner']['display_name'],
              values[i].data.items,
              data['items'][i]['images'][0]['url']
            );
            localPlaylists.push({
              id: data['items'][i]['id'],
              name: data['items'][i]['name'],
              owner: data['items'][i]['owner']['display_name'],
              tracks: values[i].data.items,
              cover: data['items'][i]['images'][0]['url'],
            });
          }
          localStorage.setItem('playlists', JSON.stringify(localPlaylists));
        });
      } else {
        return;
      }
    }
  };

  /*---------------------------- Reccomended Songs Functions  ----------------------------*/

  const [reccomendedSongs, setReccomendedSongs] = useState(
    localStorage.getItem('reccomendedSongs')
      ? JSON.parse(localStorage.getItem('reccomendedSongs'))
      : []
  );

  const addToReccomendedSongs = (
    artist,
    title,
    cover,
    albumName,
    duration,
    spotify_id
  ) => {
    setReccomendedSongs((prevState) => [
      ...prevState,
      {
        artist: artist,
        title: title,
        cover: cover,
        albumName: albumName,
        duration: duration,
        spotify_id: spotify_id,
      },
    ]);
  };

  const removeReccomendedSongs = () => {
    localStorage.removeItem('reccomendedSongs');
    setReccomendedSongs([]);
  };

  const getReccomendedSongs = async () => {
    if (!loadedSpotifyData) {
      if (reccomendedSongs.length < 1) {
        const { data } = await axios({
          method: 'GET',
          url: 'https://api.spotify.com/v1/me/top/tracks',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        let localReccomendedSongs = [];

        for (let i = 0; i < data['items'].length; i++) {
          addToReccomendedSongs(
            data['items'][i]['album']['artists'][0]['name'],
            data['items'][i]['name'],
            data['items'][i]['album']['images'][2]['url'],
            data['items'][i]['album']['name'],
            data['items'][i]['duration_ms'],
            data['items'][i]['uri']
          );
          localReccomendedSongs.push({
            artist: data['items'][i]['album']['artists'][0]['name'],
            title: data['items'][i]['name'],
            cover: data['items'][i]['album']['images'][2]['url'],
            albumName: data['items'][i]['album']['name'],
            duration: data['items'][i]['duration_ms'],
            spotify_id: data['items'][i]['uri'],
          });
        }

        localStorage.setItem(
          'reccomendedSongs',
          JSON.stringify(localReccomendedSongs)
        );
      } else {
        return;
      }
    }
  };

  /*---------------------------- Explore Songs  ----------------------------*/

  const [exploreSongs, setExploreSongs] = useState(
    localStorage.getItem('exploreSongs')
      ? JSON.parse(localStorage.getItem('exploreSongs'))
      : []
  );

  const addToExploreSongs = (
    artist,
    title,
    cover,
    albumName,
    duration,
    spotify_id
  ) => {
    setExploreSongs((prevState) => [
      ...prevState,
      {
        artist: artist,
        title: title,
        cover: cover,
        albumName: albumName,
        duration: duration,
        spotify_id,
      },
    ]);
  };

  const removeExploreSongs = () => {
    localStorage.removeItem('exploreSongs');
    setExploreSongs([]);
  };

  const getExploreSongs = async () => {
    if (!loadedSpotifyData) {
      if (exploreSongs.length < 1) {
        const { data } = await axios({
          method: 'GET',
          url: 'https://api.spotify.com/v1/browse/new-releases',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        let promises = [];

        // Since Browse API returns album objects containing the single, we need another request to extract the track
        // Object from the album object using the album URI as a request parameter
        for (let i = 0; i < data['albums']['items'].length; i++) {
          promises.push(
            axios({
              method: 'GET',
              url: `https://api.spotify.com/v1/albums/${data['albums']['items'][i]['id']}/tracks`,
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            })
          );
        }

        let localExploreSongs = [];

        Promise.all(promises).then((values) => {
          for (let i = 0; i < data['albums']['items'].length; i++) {
            console.log(data);
            console.log(data['albums']);
            console.log(data['albums']['items']);
            console.log(promises);
            console.log(values[0].data.items);

            if (data['albums']['items'][i]['album_type'] === 'single') {
              addToExploreSongs(
                data['albums']['items'][i]['artists'][0]['name'],
                data['albums']['items'][i]['name'],
                data['albums']['items'][i]['images'][2]['url'],
                'Single',
                values[i].data.items[0].duration_ms,
                values[i].data.items[0].uri
              );
              localExploreSongs.push({
                artist: data['albums']['items'][i]['artists'][0]['name'],
                title: data['albums']['items'][i]['name'],
                cover: data['albums']['items'][i]['images'][2]['url'],
                albumName: 'Single',
                duration: values[i].data.items[0].duration_ms,
                spotify_id: values[i].data.items[0].uri,
              });
            }
          }

          localStorage.setItem(
            'exploreSongs',
            JSON.stringify(localExploreSongs)
          );
        });
      } else {
        return;
      }
    }
  };

  /*---------------------------- Song Queue Functions ----------------------------*/

  const [trackURIs, setTrackURIs] = useState(
    sessionStorage.getItem('trackURIs')
      ? JSON.parse(sessionStorage.getItem('trackURIs'))
      : []
  );

  const addToTrackURIs = (newURI) => {
    setTrackURIs([...trackURIs, newURI]);
    sessionStorage.setItem('trackURIs', JSON.stringify([...trackURIs, newURI]));
  };

  const removeTrackURIs = () => {
    setTrackURIs([]);
    sessionStorage.removeItem('trackURIs');
  };

  return (
    <ChakraProvider>
      <SessionContext.Provider
        value={{
          userInfo,
          setUserInfo,
          removeUserInfo,
          accessToken,
          addAccessToken,
          removeAccessToken,
          spotifyInfo,
          getSpotifyInfoAndLogFollowers,
          removeSpotifyInfo,
          getFollowerInfo,
          followerInfo,
          removeFollowerInfo,
          loadSpotifyData,
          loadedSpotifyData,
          unloadSpotifyData,
        }}
      >
        <QueueContext.Provider
          value={{
            addToTrackURIs,
            trackURIs,
            removeTrackURIs,
          }}
        >
          <MusicContext.Provider
            value={{
              activePlaylist,
              isPlaylistActive,
              loadActivePlaylist,
              removeActivePlaylist,
              togglePlaylistView,
              playlists,
              getUsersPlaylists,
              removePlaylists,
              getReccomendedSongs,
              removeReccomendedSongs,
              reccomendedSongs,
              exploreSongs,
              getExploreSongs,
              removeExploreSongs,
              getTopArtistsAndGenres,
              topArtistsAndGenres,
              removeTopArtistsAndGenres,
            }}
          >
            <Router>
              <Route path='/' exact component={LandingScreen} />
              <Route path='/welcome' exact component={LandingScreen} />
              <Route path='/dashboard' exact component={DashboardScreen} />
              <Route path='/player' exact component={PlayerScreen} />
              <Route path='/analytics' exact component={AnalyticsScreen} />
            </Router>
          </MusicContext.Provider>
        </QueueContext.Provider>
      </SessionContext.Provider>
    </ChakraProvider>
  );
}

export default App;
