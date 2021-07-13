import React, { useContext } from 'react';
import { Grid, Typography, Paper, makeStyles } from '@material-ui/core';
import {MicOff, Videocam, Mic, ScreenShareSharp,StopScreenShare ,VideocamOffSharp} from '@material-ui/icons';
import { SocketContext } from '../SocketContext';
import { Button } from '@material-ui/core';
import Messenger from './Messenger';
//import { Container } from 'react-bootstrap';
const useStyles = makeStyles((theme) => ({
  uservideo: {
    width: '650px',
    [theme.breakpoints.down('xs')]: {
      width: '400px',
    },
  },
  myvideo: {
    width: '650px',
    [theme.breakpoints.down('xs')]: {
      width: '400px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  },
}));

const VideoPlayer = () => {
  const { name, callAccepted, myVideo,
    updateVideo,
    myMicStatus,
     updateMic, userVideo, callEnded, shareScreen, screenShare, stopScreenShare, stream, call } = useContext(SocketContext);
  const classes = useStyles();

  return (
   
    <Grid container className={classes.gridContainer}>
      {stream && (
          /*Our video*/
        <Paper className={classes.paper}>
          <Grid item xs={6} sm={3}>
            <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
            <video playsInline muted ref={myVideo} autoPlay className={classes.myvideo} />

          </Grid>
          <Button style={{ color: "grey" }}>
            <span className="icons" onClick={() => updateVideo()} tabIndex="0">
              {myVideo ? (
                <Videocam style={{ color: "#108ee9" }}/>
              ) : (
                <VideocamOffSharp style={{ color: "red" }}/>  
              )}
            </span>
            </Button>
          <Button style={{ color: "grey" }}>
            <span className="icons" onClick={() => updateMic()} tabIndex="0">
              {myMicStatus ? (
                <Mic style={{ color: "#108ee9" }}/>
              ) : (
                <MicOff style={{ color: "red" }}/>  
              )}
            </span>
            </Button>
    
            
            {screenShare ? (
                                      <Button style={{ color: "grey" }}>
                                      <span className="icons" onClick={() => stopScreenShare()} tabIndex="0">
                                         (
                                          <StopScreenShare style={{ color: "#108ee9" }}/>
                                        ) 
                                      </span>
                                      </Button>


                                  ) : (
                                    <Button style={{ color: "grey" }}>
                                      <span className="icons" onClick={() => shareScreen()} tabIndex="0">
                                         (
                                          <ScreenShareSharp style={{ color: "#108ee9" }}/>
                                        ) 
                                      </span>
                                      </Button>
                                      
                                  )}
          
        </Paper>
      )}
      {callAccepted && !callEnded && (
           /*User's video*/
        <Paper className={classes.paper}>
          <Grid item xs={6} sm={3}>
            <Typography variant="h5" gutterBottom>{call.name || 'Name'}</Typography>
            <video playsInline ref={userVideo} autoPlay className={classes.uservideo} />
          </Grid>
        </Paper>
      )}
      
    <Messenger/>
    </Grid>
  );
};

export default VideoPlayer;

