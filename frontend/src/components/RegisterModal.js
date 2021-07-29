import React, { useState, useContext } from 'react';
import axios from 'axios';
import './css/RegisterModal.css';
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

const RegisterModal = () => {
  const [first_name, setFirstName] = useState(null);
  const [last_name, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [buttonisLoading, setButtonLoading] = useState(false);
  const { setUserInfo } = useContext(SessionContext);
  const toast = useToast();

  const register = async () => {
    if (!first_name || !last_name || !email || !password || !confirmPassword) {
      toast({
        position: 'top',
        title: 'Error',
        description: 'Fill in all required fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    } else if (password !== confirmPassword) {
      toast({
        position: 'top',
        title: 'Error',
        description: 'Paswords dont match!',
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
          '/api/users',
          { email, password, first_name, last_name },
          config
        );
        toast({
          position: 'top',
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        setUserInfo(data);
      } catch (err) {
        toast({
          position: 'top',
          title: 'Error',
          description: err.response.data.message,
          status: 'error',
          duration: 3500,
          isClosable: true,
        });
        setButtonLoading(false);
      }
    }, 1600);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <div className='register' onClick={onOpen}>
        Register
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
            Register
          </ModalHeader>
          <ModalCloseButton style={{ color: 'white' }} />
          <ModalBody style={{ backgroundColor: '#24192e' }}>
            <FormControl
              style={{ marginBottom: '1.5em', color: 'white' }}
              id='first-name'
              isRequired
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            >
              <FormLabel>First Name</FormLabel>
              <Input placeholder='' />
            </FormControl>

            <FormControl
              style={{ marginBottom: '1.5em', color: 'white' }}
              id='last-name'
              value={last_name}
              isRequired
              onChange={(e) => setLastName(e.target.value)}
            >
              <FormLabel>Last Name</FormLabel>
              <Input placeholder='' />
            </FormControl>

            <FormControl
              style={{ marginBottom: '1.5em', color: 'white' }}
              id='email'
              isRequired
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            >
              <FormLabel>Email address</FormLabel>
              <Input placeholder='example@gmail.com' />
            </FormControl>

            <FormControl
              style={{ marginBottom: '1.5em', color: 'white' }}
              id='password'
              isRequired
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            >
              <FormLabel>Password</FormLabel>

              <Input type='password' placeholder='**********' />
            </FormControl>
            <FormControl
              style={{ marginBottom: '1.5em', color: 'white' }}
              id='confirm-password'
              isRequired
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            >
              <FormLabel>Confirm Password</FormLabel>

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
                  Register
                </Button>
              ) : (
                <Button
                  style={{ backgroundColor: '#563774' }}
                  onClick={register}
                >
                  Register
                </Button>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RegisterModal;
