import React, { useContext, useEffect } from 'react';
import SessionContext from '../context/SessionContext';
import MusicContext from '../context/MusicContext';
import { useHistory } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

import { Carousel } from '3d-react-carousal';
import './css/AnalyticsScreen.css';

import { Line } from 'react-chartjs-2';

import {
  Box,
  Tooltip,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Skeleton,
  SkeletonCircle,
  Badge,
} from '@chakra-ui/react';

const AnalyticsScreen = () => {
  const history = useHistory();
  const { userInfo, spotifyInfo, followerInfo } = useContext(SessionContext);
  const { topArtistsAndGenres } = useContext(MusicContext);

  useEffect(() => {
    if (!userInfo) {
      history.push('/welcome');
    }
  });

  let artistSlides = [];
  let genreSlides = [];

  if (topArtistsAndGenres['items']) {
    for (let i = 0; i < topArtistsAndGenres['items'].length; i++) {
      artistSlides.push(
        <div>
          <Tooltip
            label={topArtistsAndGenres['items'][i]['name']}
            placement='bottom'
          >
            <a
              href={topArtistsAndGenres['items'][i]['external_urls']['spotify']}
              target='_blank'
              rel='noreferrer'
            >
              <img
                src={topArtistsAndGenres['items'][i]['images'][0]['url']}
                alt=''
                style={{ maxHeight: '300px' }}
              />
            </a>
          </Tooltip>
        </div>
      );
    }

    while (artistSlides.length < 3) {
      artistSlides.push(
        <div>
          <Tooltip
            label={topArtistsAndGenres['items'][0]['name']}
            placement='bottom'
          >
            <a
              href={topArtistsAndGenres['items'][0]['external_urls']['spotify']}
              target='_blank'
              rel='noreferrer'
            >
              <img
                src={topArtistsAndGenres['items'][0]['images'][0]['url']}
                alt=''
                style={{ maxHeight: '300px' }}
              />
            </a>
          </Tooltip>
        </div>
      );
    }

    for (let i = 0; i < topArtistsAndGenres['genres'].length; i++) {
      if (topArtistsAndGenres['genres'][i].indexOf('classical') !== -1) {
        genreSlides.push(
          <div
            style={{
              fontSize: '2em',
              fontFamily: 'system-ui',
            }}
          >
            <span>&#127929; {topArtistsAndGenres['genres'][i]}</span>
          </div>
        );
      } else if (topArtistsAndGenres['genres'][i].indexOf('r&b') !== -1) {
        genreSlides.push(
          <div
            style={{
              fontSize: '2em',
              fontFamily: 'system-ui',
            }}
          >
            <span>&#127927; {topArtistsAndGenres['genres'][i]}</span>
          </div>
        );
      } else {
        genreSlides.push(
          <div
            style={{
              fontSize: '2em',
              fontFamily: 'system-ui',
            }}
          >
            <span>{topArtistsAndGenres['genres'][i]}</span>
          </div>
        );
      }
    }
  }

  // The following code calculates and formats the percentages for weekly/monthly followe changes
  let weeklyPercentageChange = spotifyInfo['followers']
    ? ((spotifyInfo['followers']['total'] -
        (spotifyInfo['followers']['total'] - followerInfo.weeklyChange)) /
        (spotifyInfo['followers']['total'] - followerInfo.weeklyChange)) *
      100
    : 0;

  weeklyPercentageChange = isNaN(weeklyPercentageChange)
    ? 0
    : weeklyPercentageChange;

  weeklyPercentageChange = weeklyPercentageChange.toString();

  weeklyPercentageChange = weeklyPercentageChange.slice(
    0,
    weeklyPercentageChange.indexOf('.') + 3
  );

  weeklyPercentageChange = Number(weeklyPercentageChange);

  let monthlyPercentageChange = spotifyInfo['followers']
    ? ((spotifyInfo['followers']['total'] -
        (spotifyInfo['followers']['total'] - followerInfo.monthlyChange)) /
        (spotifyInfo['followers']['total'] - followerInfo.monthlyChange)) *
      100
    : 0;
  
    monthlyPercentageChange = isNaN(monthlyPercentageChange)
  ? 0
  : monthlyPercentageChange;

  monthlyPercentageChange = monthlyPercentageChange.toString();
  monthlyPercentageChange = monthlyPercentageChange.slice(
    0,
    monthlyPercentageChange.indexOf('.') + 3
  );
  monthlyPercentageChange = Number(monthlyPercentageChange);

  /* Line Chart for followers */

  let monthMap = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec',
  };

  let today = new Date();
  let months = [];

  let num = today.getMonth() - 1;

  for (let i = 0; i < 6; i++) {
    if (num < 0) {
      months.push(monthMap[11 - Math.abs(num)]);
    } else {
      months.push(monthMap[num]);
    }

    num = num - 1;
  }

  months = months.reverse();

  const data = {
    labels: months,
    datasets: [
      {
        label: '# of Followers',
        data: followerInfo.lastSixMonthsFollowers,
        fill: false,
        backgroundColor: 'red',
        borderColor: 'black',
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    plugins: {
      title: {
        display: true,
        text: 'Last 6 Months',
      },
    },
  };

  return (
    <div className='main-player'>
      <Sidebar />
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          height: '100vh',
          width: '100%',
        }}
        bgGradient='linear(to-t, #9756fc, pink.500)'
        id='style-6'
      >
        <div className='spotify-display-details'>
          <div
            style={{ display: 'flex', marginBottom: '4em', marginTop: '1em' }}
          >
            {spotifyInfo['images'] ? (
              <Skeleton isLoaded>
                <img
                  src={spotifyInfo['images'][0]['url']}
                  className='profile-pic'
                />
              </Skeleton>
            ) : (
              <SkeletonCircle size='150' />
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: '1em',
              }}
            >
              {spotifyInfo['display_name'] ? (
                <Skeleton isLoaded>
                  <h1>{spotifyInfo['display_name']}</h1>
                </Skeleton>
              ) : (
                <Skeleton>
                  <h1>Placeholder</h1>
                </Skeleton>
              )}
            </div>
          </div>
          <hr />
        </div>

        <div style={{ paddingBottom: '4em' }}>
          <h2>Your Top Artists</h2>
          {topArtistsAndGenres['items'] ? (
            <Skeleton isLoaded>
              <Carousel slides={artistSlides} autoplay={false} />
            </Skeleton>
          ) : (
            <div style={{ marginLeft: '5em', marginRight: '5em' }}>
              <Skeleton height='150px' />
            </div>
          )}
        </div>

        <div style={{ marginBottom: '4em' }}>
          <h2>Followers</h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {(followerInfo.weeklyChange || followerInfo.weeklyChange >= 0) &&
              spotifyInfo['followers'] ? (
                <Skeleton isLoaded>
                  <div
                    style={{
                      marginLeft: '5em',
                      marginRight: '5em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Stat>
                      <StatLabel style={{ fontSize: '2em' }}>1W</StatLabel>
                      <StatNumber style={{ fontSize: '3em' }}>
                        {followerInfo.weeklyChange >= 0
                          ? '+' + followerInfo.weeklyChange
                          : followerInfo.weeklyChange}
                      </StatNumber>
                      <StatHelpText>
                        {followerInfo.weeklyChange >= 0 ? (
                          <StatArrow type='increase' />
                        ) : (
                          <StatArrow type='decrease' />
                        )}
                        {weeklyPercentageChange}%
                      </StatHelpText>
                    </Stat>
                  </div>
                </Skeleton>
              ) : (
                <Skeleton>
                  <div
                    style={{
                      marginLeft: '5em',
                      marginRight: '5em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Stat>
                      <StatLabel style={{ fontSize: '2em' }}>1W</StatLabel>
                      <StatNumber style={{ fontSize: '3em' }}>9</StatNumber>
                      <StatHelpText>
                        <StatArrow type='decrease' />
                        9.05%
                      </StatHelpText>
                    </Stat>
                  </div>
                </Skeleton>
              )}

              {spotifyInfo['followers'] ? (
                <Skeleton isLoaded>
                  <div className='follower-count'>
                    {spotifyInfo['followers']['total']}
                  </div>
                </Skeleton>
              ) : (
                <Skeleton>
                  <div className='follower-count'>5</div>
                </Skeleton>
              )}

              {(followerInfo.monthlyChange ||
                followerInfo.monthlyChange >= 0) &&
              spotifyInfo['followers'] ? (
                <Skeleton isLoaded>
                  <div
                    style={{
                      marginLeft: '5em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Stat>
                      <StatLabel style={{ fontSize: '2em' }}>1M</StatLabel>
                      <StatNumber style={{ fontSize: '3em' }}>
                        {followerInfo.monthlyChange >= 0
                          ? '+' + followerInfo.monthlyChange
                          : followerInfo.monthlyChange}
                      </StatNumber>
                      <StatHelpText>
                        {followerInfo.monthlyChange >= 0 ? (
                          <StatArrow type='increase' />
                        ) : (
                          <StatArrow type='decrease' />
                        )}
                        {monthlyPercentageChange}%
                      </StatHelpText>
                    </Stat>
                  </div>
                </Skeleton>
              ) : (
                <Skeleton>
                  <div
                    style={{
                      marginLeft: '5em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Stat>
                      <StatLabel style={{ fontSize: '2em' }}>1M</StatLabel>
                      <StatNumber style={{ fontSize: '3em' }}>5</StatNumber>
                      <StatHelpText>
                        <StatArrow type='decrease' />
                        3%
                      </StatHelpText>
                    </Stat>
                  </div>
                </Skeleton>
              )}

              {followerInfo.lastSixMonthsFollowers ? (
                <Skeleton isLoaded>
                  <div
                    style={{
                      marginLeft: '5em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Line
                      data={data}
                      options={options}
                      style={{ height: '800px', width: '400px' }}
                    />
                  </div>
                </Skeleton>
              ) : (
                <Skeleton>
                  <div
                    style={{
                      marginLeft: '5em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Line
                      data={[1, 2, 3, 4, 5, 6]}
                      options={options}
                      style={{ height: '800px', width: '400px' }}
                    />
                  </div>
                </Skeleton>
              )}
            </Box>
          </div>
        </div>

        <div style={{ marginBottom: '2em' }}>
          <h2>Your Top Genres</h2>

          {topArtistsAndGenres['items'] ? (
            <Skeleton isLoaded>
              <div className='genre-bar'>
                <Carousel slides={genreSlides} autoplay={false} />
              </div>
            </Skeleton>
          ) : (
            <div style={{ marginLeft: '5em', marginRight: '5em' }}>
              <Skeleton height='150px' />
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2em' }}>
          <i className='fas fa-code' /> with <i className='fas fa-heart' /> by{' '}
          <a href='https://github.com/bzia/' target='_blank'>
            <Badge colorScheme='blackAlpha'>Bobby Zia</Badge>
          </a>{' '}
          using <i className='fab fa-react' />
        </div>
      </Box>
    </div>
  );
};

export default AnalyticsScreen;
