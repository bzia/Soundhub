import React, { useState, useContext } from 'react';
import './css/LoginModal.css';
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
} from '@chakra-ui/react';
import SessionContext from '../context/SessionContext';
import axios from 'axios';

const LoginModal = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [buttonisLoading, setButtonLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const { setUserInfo } = useContext(SessionContext);

  const login = async () => {
    if (!email || !password) {
      toast({
        position: 'top',
        title: 'Error',
        description: 'Fill in all required fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setButtonLoading(true);

    setTimeout(async function () {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };

        const { data } = await axios.post(
          '/api/users/login',
          { email, password },
          config
        );
        toast({
          position: 'top',
          description: 'Login Successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setUserInfo(data);
      } catch (err) {
        toast({
          position: 'top',
          title: 'Error',
          description: err.response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setButtonLoading(false);
      }
    }, 1600);
  };

  return (
    <>
      <div className='login' onClick={onOpen}>
        Login
      </div>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        size={'xl'}
        isCentered
        colorScheme='modal.backgroundColor'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader style={{ backgroundColor: '#24192e', color: 'white' }}>
            Login
          </ModalHeader>
          <ModalCloseButton style={{ color: 'white' }} />
          <ModalBody style={{ backgroundColor: '#24192e' }}>
            <FormControl
              style={{ marginBottom: '1.5em', color: 'white' }}
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
            >
              <FormLabel>Email Address</FormLabel>
              <Input placeholder='example@gmail.com' />
            </FormControl>

            <FormControl
              style={{ marginBottom: '1.5em', color: 'white' }}
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
            >
              <FormLabel>Password</FormLabel>

              <Input type='password' placeholder='**********' />
            </FormControl>

            <div
              style={{
                marginTop: '2em',
                marginBottom: '0.5em',
              }}
            >
              {buttonisLoading ? (
                <Button
                  isLoading
                  style={{ backgroundColor: '#563774', color: 'white' }}
                >
                  Login
                </Button>
              ) : (
                <Button
                  style={{ backgroundColor: '#563774', color: 'white' }}
                  onClick={login}
                >
                  Login
                </Button>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginModal;
