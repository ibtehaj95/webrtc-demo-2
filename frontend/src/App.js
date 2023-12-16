import React, { useEffect, useState, useRef } from "react";
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import "./App.scss";
import io from "socket.io-client";

function App (){

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const pcRef = useRef(null);
    const textRef = useRef(null);
    const [cameraOn, setCameraOn] = useState(false);
    const [socket] = useState(io(
        "http://localhost:8080/webRTCPeers",    //if you don't specify the exact URL and port (like this http://localhost:8080/webRTCPeers), it will try to connect to the same URL and port as the frontend
        { 
            path: "/webrtc" 
        }));    //this is the backened socket.io server
    // const candidates = useRef([]);
    const [offerVisible, setOfferVisible] = useState(true);
    const [answerVisible, setAnswerVisible] = useState(false);
    const [callStatus, setCallStatus] = useState("Not Calling");

    const sendToPeer = (eventType, payload) => {
        socket.emit(eventType, payload);    // send the event type and the payload to the Socket.IO signaling server
    }

    const handleStartWebcam = () => {
        getUserMedia(); // get the user's webcam/microphone stream
    };

    const handleStopWebcam = () => {
        localVideoRef.current.srcObject.getTracks().forEach(track => track.stop()); // stop all tracks in the stream
        localVideoRef.current.srcObject = null; // remove the stream from the video element
        setCameraOn(false); // enable the start camera button
    };

    const processSDP = (sdp) => {
        console.log(JSON.stringify(sdp));
                // save your SDP in local description
                pcRef.current.setLocalDescription(sdp); // you should have a handler for ICE candidates before this point. Already done in useEffect at component mount
                sendToPeer("sdp", {sdp}); // send the SDP to the other party via the Socket.IO signaling server
    };

    const createOffer = () => {
        // the sender sends an offer to the receiver
        pcRef.current.createOffer({ 
            offerToReceiveVideo: 1, // we want to receive video from the answerer
            offerToReceiveAudio: 1, // we want to receive audio from the answerer
        })
            .then(sdp => {
              processSDP(sdp);
              setOfferVisible(false);
              setCallStatus("Calling");
            })
            .catch(error => {
                console.error(error);
            });
    };

    const createAnswer = () => {
        // the answerer sends an answer to the offerer
        pcRef.current.createAnswer({ 
            offerToReceiveVideo: 1, // we want to receive video from the offerer
            offerToReceiveAudio: 1, // we want to receive audio from the offerer
        })
            .then(sdp => {
                processSDP(sdp);
                setAnswerVisible(false);
                setCallStatus("In Call");
            })
            .catch(error => {
                console.error(error);
            });
    };

    const userAllMediaDevices = () => {
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                devices.forEach(device => {
                    console.log(device.kind.toUpperCase(), device.label);
                })
            })
            .catch(err => {
                console.error(err);
            });
    };

    const getUserMedia = () => {
        const constraints = { video: true, audio: false }; // specify what kind of streams we want
        // prompt the user for permission to use specified devices
        // note that if a user has multiple cameras/microphones, we can find those out (enumerate) specify which ones to use, otherwise OS default will be used
        // https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API
        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                localVideoRef.current.srcObject = stream; // set the source of the video element to the captured stream, this is for you to see yourself
                stream.getTracks().forEach(track => pcRef.current.addTrack(track, stream)); // add the stream to the RTCPeerConnection object, this is for the other party to see you
                // stream.getTracks().forEach(track => console.log(track)); // print the tracks in the stream
                // remoteVideoRef.current.srcObject = stream; // only for testing
                setCameraOn(true); // disable the start camera button
            })
            .catch(error => {
                console.error("Error accessing media devices.", error);
            });
    };

    const showHideButtons = () => {
        if (offerVisible) {
            return(
                <div>
                    <Button variant="contained" color="primary" onClick={createOffer} sx={{margin: 1, width: "max-content"}}>
                        Call
                    </Button>
                </div>
            )
        }
        else if (answerVisible) {
            return(
                <div>
                    <Button variant="contained" color="primary" onClick={createAnswer} sx={{margin: 1, width: "max-content"}}>
                        Answer
                    </Button>
                </div>
            )
        }
    }

    useEffect(() => {
        handleStartWebcam();    // get the user's webcam/microphone stream on component mount
        
        const pc = new RTCPeerConnection(null); // create a new RTCPeerConnection
        
        pc.onicecandidate = (e) => {
            if (e.candidate) {
                console.log(JSON.stringify(e.candidate));
                // socket.emit("candidate", e.candidate); // send the ICE candidate to the other party via the Socket.IO signaling server
                sendToPeer("candidate", e.candidate); // send the ICE candidate to the other party via the Socket.IO signaling server
            }
        };
        
        pc.oniceconnectionstatechange = (e) => {
            console.log("ICE Connection State Change", e); // connected, disconnected, failed, closed
        };

        pc.ontrack = (e) => {
            remoteVideoRef.current.srcObject = e.streams[0]; // set the source of the video element to the received stream
        }

        pcRef.current = pc; // store the RTCPeerConnection object in the ref, we are using pcRef like a global variable
        // from this point on, pc will not be addressed directly, but rather through pcRef.current, because it doesn't exist outside of this useEffect block
        
        socket.on("connection-success", (success) => {
            console.log(success);
        });

        socket.on("sdp", (data) => {
            console.log(data);
            pcRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp)); // set the remote description to the received SDP
            textRef.current.value = JSON.stringify(data.sdp);   // comment to go into the manual mode
            if (data.sdp.type === "offer") {
                setOfferVisible(false);
                setAnswerVisible(true);
                setCallStatus("Incoming Call");
            }
            else{
                setCallStatus("In Call");
            }
        });

        socket.on("candidate", (candidate) => {
            console.log(candidate);
            // candidates.current = [...candidates.current, candidate]; // comment to go into the manual mode
            pcRef.current.addIceCandidate(new RTCIceCandidate(candidate)); // add the received ICE candidate to the RTCPeerConnection object
        });

    }, []);

    return(
        <div className="App">
            <div className="title">Video Streaming App</div>
            <div className="videos-container">
                <div className="names-row">
                    <div className="name">Local Stream</div>
                    <div className="name">Remote Stream</div>
                </div>
                <div className="videos-row">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        className="local-video"
                        style={{
                            width: 480, 
                            height: 300,
                            margin: 5,
                            backgroundColor: "black"
                        }}
                    />
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        muted
                        className="remote-video"
                        style={{
                            width: 480, 
                            height: 300,
                            margin: 5,
                            backgroundColor: "black"
                        }}
                    />
                </div>
            </div>
            <div className="inputs-container">
                <Button variant="contained" color="primary" onClick={userAllMediaDevices} sx={{margin: 1, width: "max-content"}}>
                    Show All Media Devices
                </Button>
                <Button variant="contained" color="primary" onClick={cameraOn?handleStopWebcam:handleStartWebcam} sx={{margin: 1, width: "max-content"}}>
                    {cameraOn ? "Stop Webcam" : "Start Webcam"}
                </Button>
                {/* <Button variant="contained" color="primary" onClick={createOffer} sx={{margin: 1, width: "max-content"}}>
                    Create Offer
                </Button>
                <Button variant="contained" color="primary" onClick={createAnswer} sx={{margin: 1, width: "max-content"}}>
                    Create Answer
                </Button> */}
                {showHideButtons()}
                <div>{callStatus}</div>
                <TextField
                        inputRef={textRef}
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{ margin: 1}}
                />
            </div>
        </div>
    );
}

    export default App;
