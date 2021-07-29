import React, { useContext } from 'react';
import './css/DashboardScreen.css';
import Sidebar from '../components/Sidebar';

import Typewriter from 'typewriter-effect';
import { Divider } from '@chakra-ui/react';
import SessionContext from '../context/SessionContext';
import { useHistory } from 'react-router-dom';

const DashboardScreen = () => {
  const history = useHistory();
  const { userInfo } = useContext(SessionContext);

  if (!userInfo) {
    history.push('/welcome');
  }

  return (
    <div>
      {true ? (
        <div className='main-dashboard'>
          <Sidebar />
          <div className='dashboard-container'>
            <div className='dashboard-title'>
              <Typewriter
                options={{
                  delay: 100,
                }}
                onInit={(typewriter) => {
                  typewriter.typeString('Welcome').stop().start();
                  return;
                }}
              />
            </div>
            <Divider style={{ opacity: '0.2' }} />
            <div className='dashboard-text'>
              <Typewriter
                options={{
                  delay: 40,
                }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString('Connect your spotify to get started...')
                    .stop()
                    .start()
                    .changeCursor(' ');
                  return;
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className='main-dashboard'>
          <Sidebar />
          <div className='dashboard-container'>
            <div className='dashboard-title'>
              <Typewriter
                options={{
                  delay: 100,
                }}
                onInit={(typewriter) => {
                  typewriter.typeString('Welcome').stop().start();
                  return;
                }}
              />
            </div>
            <Divider style={{ opacity: '0.2' }} />
            <div className='dashboard-text'>
              <Typewriter
                options={{
                  delay: 40,
                }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString('Connect your spotify to get started...')
                    .stop()
                    .start()
                    .changeCursor(' ');
                  return;
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
