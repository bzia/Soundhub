/*
  
- This component uses a Card component from material UI.
- In order to make the cards pop with highlighting and 3d-scaling, I used 
  raised and shadow, as per the Card API

*/

import React, { useContext, useState } from 'react';
import './css/PlaylistItem.css';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';

import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import MusicContext from '../context/MusicContext';

const PlaylistItem = (props) => {
  const useStyles = makeStyles({
    root: {
      backgroundColor: '#282828',
      paddingLeft: '2em',
      paddingRight: '2em',
      paddingTop: '2em',
      paddingBottom: '1em',
      marginBottom: '3em',
      marginRight: '1em',
      marginLeft: '1em',
      transition: 'transform 0.15s ease-in-out',
    },
    cardHovered: {
      transform: 'scale3d(0.98, 0.98, 0.98)',
      backgroundColor: '#171717',
    },
    media: {
      minWidth: 190,
      minHeight: 190,
      boxShadow: '0px 0px 5px #fff',
    },
  });
  const classes = useStyles();
  const { loadActivePlaylist, togglePlaylistView } = useContext(MusicContext);

  const viewPlaylist = () => {
    togglePlaylistView();

    loadActivePlaylist(props.obj);
  };

  const [state, setState] = useState({
    raised: true,
    shadow: 1,
  });

  return (
    <Card
      className={classes.root}
      classes={{ root: state.raised ? classes.cardHovered : '' }}
      onMouseOut={() => setState({ raised: true, shadow: 3 })}
      onMouseOver={() => setState({ raised: false, shadow: 1 })}
      raised={state.raised}
      zdepth={state.shadow}
    >
      <CardActionArea onClick={() => viewPlaylist()}>
        <CardMedia className={classes.media} image={props.cover} />
        <CardContent style={{ paddingLeft: '0' }}>
          <div>
            <span className='playlist-title'>{props.name}</span>
            <br />
            <span className='playlist-creator'>{props.owner}</span>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PlaylistItem;
