import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Divider,
} from '@chakra-ui/react';
import SessionContext from '../context/SessionContext';
import MusicContext from '../context/MusicContext';
import { useHistory } from 'react-router-dom';
import QueueContext from '../context/QueueContext';

const ProfileModal = () => {
  const {
    userInfo,
    removeUserInfo,
    setUserInfo,

    removeAccessToken,
    removeSpotifyInfo,
    removeFollowerInfo,
    unloadSpotifyData,
  } = useContext(SessionContext);
  const {
    removePlaylists,
    removeReccomendedSongs,
    removeExploreSongs,
    removeTopArtistsAndGenres,
  } = useContext(MusicContext);
  const { removeTrackURIs } = useContext(QueueContext);

  const history = useHistory();
  const [logoutButtonIsLoading, setLogoutButtonIsLoading] = useState(false);
  const [changeButtonIsLoading, setChangeButtonIsLoading] = useState(false);
  const [userId, setUserID] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const initials = userInfo
    ? userInfo.first_name[0].toUpperCase() + userInfo.last_name[0].toUpperCase()
    : null;

  const first = userInfo ? userInfo.first_name : '';
  const last = userInfo ? userInfo.last_name : '';

  useEffect(() => {
    if (!userInfo) {
      history.push('/welcome');
    } else {
      const id = userInfo ? userInfo.id : '';
      setUserID(id);
    }
  }, [userInfo, history]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const submitProfileChangesHandler = () => {
    if (!currentPassword) {
      toast({
        position: 'top',
        title: 'Error',
        description: 'Must enter current password to make profile changes!',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    } else if (
      (newPassword && !confirmNewPassword) ||
      (!newPassword && confirmNewPassword) ||
      newPassword !== confirmNewPassword
    ) {
      toast({
        position: 'top',
        title: 'Error',
        description: 'New passwords must match!',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setChangeButtonIsLoading(true);

    setTimeout(async function () {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };

        const { data } = await axios.put(
          '/api/users/edit',
          { userId, firstName, lastName, currentPassword, newPassword },
          config
        );
        toast({
          position: 'top',
          description: 'Successfully Updated Profile!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setUserInfo(data);
        setChangeButtonIsLoading(false);
      } catch (err) {
        toast({
          position: 'top',
          title: 'Error',
          description: err.response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setChangeButtonIsLoading(false);
      }
    }, 800);
  };

  const submitLogoutHandler = () => {
    setLogoutButtonIsLoading(true);

    setTimeout(function () {
      toast({
        position: 'top',
        description: 'Successfully logged out...',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      // remove userInfo from state
      removeUserInfo();
      removeAccessToken();
      removePlaylists();
      removeReccomendedSongs();
      removeExploreSongs();
      removeSpotifyInfo();
      removeTopArtistsAndGenres();
      removeFollowerInfo();
      unloadSpotifyData();
      removeTrackURIs();
      // remove userInfo from local storage
      localStorage.removeItem('userInfo');
    }, 1500);
  };
  return (
    <>
      <div data-initials={initials} onClick={onOpen}></div>
      <Modal
        onClose={() => {
          // We must revert all form state to empty strings
          // (if we dont, then a form may wrongly be identified as valid after the modal close then open)
          setFirstName('');
          setLastName('');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
          onClose();
        }}
        isOpen={isOpen}
        size={'sm'}
        isCentered
        colorScheme='modal.backgroundColor'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            style={{
              backgroundColor: '#24192e',
              color: 'white',
            }}
          >
            Profile
          </ModalHeader>

          <ModalCloseButton style={{ color: 'white' }} />

          <ModalBody
            style={{
              backgroundColor: '#24192e',
              paddingTop: '1em',
              borderTop: '1px solid rgb(221, 221, 221, 0.2)',
            }}
          >
            <FormControl
              style={{ marginBottom: '1.5em', color: 'white' }}
              id='name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            >
              <FormLabel>First Name</FormLabel>
              <Input placeholder={first} />
            </FormControl>

            <FormControl
              style={{ marginBottom: '1.5em', color: 'white' }}
              id='name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            >
              <FormLabel>Last Name</FormLabel>

              <Input placeholder={last} />
            </FormControl>
            <FormControl
              style={{ marginBottom: '1.5em', color: 'white' }}
              id='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            >
              <FormLabel>New Password</FormLabel>

              <Input type='password' />
            </FormControl>
            <FormControl
              style={{ marginBottom: '1.5em', color: 'white' }}
              id='password'
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            >
              <FormLabel>Confirm New Password</FormLabel>

              <Input type='password' />
            </FormControl>
            <Divider style={{ border: '1px solid rgb(255,255,255,0.15)' }} />
            <FormControl
              style={{
                marginBottom: '1.5em',
                marginTop: '1.5em',
                color: 'white',
              }}
              id='password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              isRequired
            >
              <FormLabel>Current Password</FormLabel>

              <Input type='password' placeholder='*****' />
            </FormControl>
            <div
              style={{
                color: '#A3A3A3',
                fontSize: '0.85em',
                marginBottom: '1em',
              }}
            >
              * new password and each name fields are optional *
            </div>

            <div>
              {changeButtonIsLoading ? (
                <Button
                  style={{
                    backgroundColor: '#563774',
                    color: 'white',
                    marginBottom: '1em',
                    marginRight: '1em',
                  }}
                  isLoading
                >
                  <i
                    class='fas fa-save fa-2x'
                    style={{ color: 'white', marginRight: '0.3em' }}
                  ></i>
                  Save Changes
                </Button>
              ) : (
                <Button
                  style={{
                    backgroundColor: '#563774',
                    color: 'white',
                    marginBottom: '1em',
                    marginRight: '1em',
                  }}
                  onClick={submitProfileChangesHandler}
                >
                  <i
                    class='fas fa-save fa-2x'
                    style={{ color: 'white', marginRight: '0.3em' }}
                  ></i>
                  Save Changes
                </Button>
              )}

              {logoutButtonIsLoading ? (
                <Button
                  style={{
                    backgroundColor: '#563774',
                    color: 'white',
                    marginBottom: '1em',
                  }}
                  isLoading
                >
                  <i
                    class='fas fa-sign-out-alt fa-2x'
                    style={{ color: 'white', marginRight: '0.3em' }}
                  ></i>
                  Logout
                </Button>
              ) : (
                <Button
                  style={{
                    backgroundColor: '#563774',
                    color: 'white',
                    marginBottom: '1em',
                  }}
                  onClick={submitLogoutHandler}
                >
                  <i
                    class='fas fa-sign-out-alt fa-2x'
                    style={{ color: 'white', marginRight: '0.3em' }}
                  ></i>
                  Logout
                </Button>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
