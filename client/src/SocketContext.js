import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

 const socket = io('https://microsoft-engage-teams.herokuapp.com/');

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const [myVdoStatus, setMyVdoStatus] = useState(true);
  const [userVdoStatus, setUserVdoStatus] = useState();
  const [myMicStatus, setMyMicStatus] = useState(true);
  const [userMicStatus, setUserMicStatus] = useState();
  const [screenShare, setScreenShare] = useState(false)
  const [msgRcv, setMsgRcv] = useState("");
// message
  //const [ state, setState ] = useState({ message: "", name: "" })
//	const [ chat, setChat ] = useState([])

//	const socketRef = useRef()
//
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });

    socket.on('me', (id) => setMe(id));

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
    socket.on("updateUserMedia", ({ type, currentMediaStatus }) => {
      if (currentMediaStatus !== null || currentMediaStatus !== []) {
        switch (type) {
          case "video":
            setUserVdoStatus(currentMediaStatus);
            break;
          case "mic":
            setUserMicStatus(currentMediaStatus);
            break;
          default:
            setUserMicStatus(currentMediaStatus[0]);
            setUserVdoStatus(currentMediaStatus[1]);
            break;
        }
      }
    });
    socket.on("endCall", () => {
      window.location.reload();
    });

    socket.on("msgRcv", ({ name, msg: value, sender }) => {
      setMsgRcv({ value, sender });
      setTimeout(() => {
        setMsgRcv({});
      }, 2000);
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from,  type: "both",
      myMediaStatus: [myMicStatus, myVdoStatus], });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };


  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
      socket.emit("updateMyMedia", {
        type: "both",
        currentMediaStatus: [myMicStatus, myVdoStatus],
      });
    });

    connectionRef.current = peer;
  };
  
  const updateVideo = () => {
    setMyVdoStatus((currentStatus) => {
      socket.emit("updateMyMedia", {
        type: "video",
        currentMediaStatus: !currentStatus,
      });
      stream.getVideoTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };
  const updateMic = () => {
    setMyMicStatus((currentStatus) => {
      socket.emit("updateMyMedia", {
        type: "mic",
        currentMediaStatus: !currentStatus,
      });
      stream.getAudioTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };
  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };
   

  
  const shareScreen = () => {
    navigator.mediaDevices.getDisplayMedia({cursor: true})
    .then(currentStream => {
        setScreenShare(true)
        setStream(stream)
        myVideo.current.srcObject = currentStream
        const videoTrack = currentStream.getVideoTracks()[0]
        const peer = connectionRef.current
        if(peer) {
            peer.replaceTrack(
                peer.streams[0].getVideoTracks()[0], 
                videoTrack,
                peer.streams[0]
            )
        }
        videoTrack.onended = () => {
            peer.replaceTrack (
                peer.streams[0].getVideoTracks()[0], 
                stream.getVideoTracks()[0],
                peer.streams[0]
            )
            myVideo.current.srcObject = stream
        }
        
    })
}
const stopScreenShare = () => {
    setScreenShare(false)
    const peer = connectionRef.current
    peer.replaceTrack (
        peer.streams[0].getVideoTracks()[0], 
        stream.getVideoTracks()[0],
        peer.streams[0]
    )
    myVideo.current.srcObject = stream
}
  

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      shareScreen,
      answerCall,
      stopScreenShare,
      setMyVdoStatus,
      screenShare,
      userVdoStatus,
      setUserVdoStatus,
      updateVideo,
      myMicStatus,
      userMicStatus,
      updateMic,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };