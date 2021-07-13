import React, { useContext,useState } from 'react';
import { Button } from '@material-ui/core';
import {Navbar, Nav, Form, FormControl} from 'react-bootstrap';
import { SocketContext } from '../SocketContext';
import { Assignment, Phone, PhoneDisabled } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';

import { Card } from 'react-bootstrap';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridContainer: {
    width: '150%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
 
  container: {
    width: '600px',
    margin: '0px 0',
    padding: 0,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  margin: {
    marginTop: 20,
  },
  padding: {
    padding: 20,
  },
  paper: {
    padding: '10px 20px',
    border: '2px solid black',
  },
  wrapper: {
    
    width: '100%',
  },
}));

const Nav_bar = () => {
  const { answerCall,callEnded, call, callAccepted, leaveCall } = useContext(SocketContext);
  const classes = useStyles();
  return (
    <>
      
      <div className={classes.wrapper}>
  <Navbar bg="primary" variant="dark">
    <Navbar.Brand href="#">Video Chat App</Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="/room">Room</Nav.Link>
    </Nav>
    <div>
    {callAccepted && !callEnded ? (
                <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} onClick={leaveCall} className={classes.margin}>
                  Hang Up
                </Button>
              ) : (
                <div></div>
              )}
         </div>     
  </Navbar></div>

  

    </>
  );
};

export default Nav_bar;