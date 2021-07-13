import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
//import {Modal} from 'react-bootstrap';
import { SocketContext } from '../SocketContext';


const Notifications = () => {
  const { answerCall, call, callAccepted, leaveCall } = useContext(SocketContext);

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h1>{call.name} is calling :</h1>
          <Button variant="contained" color="primary" onClick={answerCall}>
            Answer
          </Button>
          <Button variant="contained" color="secondary" onClick={leaveCall}>
            Reject
          </Button>
        </div>
      )}
    </>
  );
};

export default Notifications;
/*
const Notifications = () => {
  const { answerCall, callUser, call, callAccepted, leaveCall} = useContext(SocketContext);
  const [show, setShow] = useState(false);

  return (
    <>
    <Button variant="primary" onClick={callUser}>
        Launch demo modal
      </Button>
      {call.isReceivingCall && !callAccepted && (
      <Modal show={show} >
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h1>{call.name} is calling:</h1>

        </div>
     
        </Modal.Body>
        <Modal.Footer>
        <Button variant="contained" color="primary" onClick={answerCall}>
            Answer
          </Button>
          <Button variant="contained" color="secondary" onClick={leaveCall}>
            Reject
          </Button>
        </Modal.Footer>
      </Modal>
       )}
     
    </>
  );
};

*/