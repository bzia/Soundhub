import React, { useContext, useEffect } from 'react';
import './css/LandingScreen.css';
import Typewriter from 'typewriter-effect';

import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';

import { Badge } from '@chakra-ui/react';
import SessionContext from '../context/SessionContext';
import { useHistory } from 'react-router-dom';

const LandingScreen = () => {
  const history = useHistory();
  const { userInfo } = useContext(SessionContext);
  useEffect(() => {
    if (userInfo) {
      history.push('/dashboard');
    }
  });

  return (
    <div className='landing'>
      <div className='item1'>
        <div className='main-title'>
          <Typewriter
            onInit={(typewriter) => {
              typewriter
                .typeString('SoundHub')
                .stop()
                .start()
                .changeCursor('.');
              return;
            }}
          />
        </div>
        <div className='outer-login'>
          <LoginModal />
          <RegisterModal />
        </div>
      </div>
      <footer className='landing-footer'>
        <i className='fas fa-code' /> with <i className='fas fa-heart' /> by{' '}
        <a href='https://github.com/bzia/' target='_blank' rel='noreferrer'>
          <Badge colorScheme='blackAlpha'>Bobby Zia</Badge>
        </a>{' '}
        using <i className='fab fa-react' />
      </footer>
    </div>
  );
};

export default LandingScreen;
