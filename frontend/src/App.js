import React, { useEffect, useState, useRef } from "react";
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import "./App.scss";

function App (){

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const pcRef = useRef(null);
    const textRef = useRef(null);
    const [cameraOn, setCameraOn] = useState(false);

    const handleStartWebcam = () => {
        getUserMedia(); // get the user's webcam/microphone stream
    };

    const handleStopWebcam = () => {
        localVideoRef.current.srcObject.getTracks().forEach(track => track.stop()); // stop all tracks in the stream
        localVideoRef.current.srcObject = null; // remove the stream from the video element
        setCameraOn(false); // enable the start camera button
    };

    const createOffer = () => {
        // the sender sends an offer to the receiver
        pcRef.current.createOffer({ 
            offerToReceiveVideo: 1, // we want to receive video from the answerer
            offerToReceiveAudio: 1, // we want to receive audio from the answerer
        })
            .then(sdp => {
                console.log(JSON.stringify(sdp));
                // save your SDP in local description
                pcRef.current.setLocalDescription(sdp); // you should have a handler for ICE candidates before this point. Already done in useEffect at component mount
                // at this point you should see ICE candidates in the console
                // these ICE candidates are of the offerer
                // the offerer should send the offer to the answerer
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
                console.log(JSON.stringify(sdp));
                // save your SDP in local description
                pcRef.current.setLocalDescription(sdp); // you should have a handler for ICE candidates before this point. Already done in useEffect at component mount
                // at this point you should see ICE candidates in the console
                // these ICE candidates are of the answerer
                // the answerer should send the answer to the offerer
            })
            .catch(error => {
                console.error(error);
            });
    };

    const createAndSetRemoteDesc = () => {
        // whether you are the offerer or the answerer, you have to set the remote description of the other party
        // for that you need to get the SDP of the other party
        const sdp = JSON.parse(textRef.current.value);
        console.log(sdp);
        pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    };

    const addICECandidate = () => {
        const iceCandidate = JSON.parse(textRef.current.value);
        console.log(iceCandidate);
        pcRef.current.addIceCandidate(new RTCIceCandidate(iceCandidate));
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
                localVideoRef.current.srcObject = stream; // set the source of the video element to the captured stream
                stream.getTracks().forEach(track => pcRef.current.addTrack(track, stream)); // add the stream to the RTCPeerConnection object
                // remoteVideoRef.current.srcObject = stream; // only for testing
                setCameraOn(true); // disable the start camera button
            })
            .catch(error => {
                console.error("Error accessing media devices.", error);
            });
    };

    useEffect(() => {
        handleStartWebcam();    // get the user's webcam/microphone stream on component mount
        
        const pc = new RTCPeerConnection(null); // create a new RTCPeerConnection
        
        pc.onicecandidate = (e) => {
            if (e.candidate) {
                console.log(JSON.stringify(e.candidate));
            }
        };
        
        pc.oniceconnectionstatechange = (e) => {
            console.log("ICE Connection State Change", e); // connected, disconnected, failed, closed
        };

        pc.ontrack = (e) => {
            console.log("Track received:");
            remoteVideoRef.current.srcObject = e.streams[0]; // set the source of the video element to the received stream
        }

        pcRef.current = pc; // store the RTCPeerConnection object in the ref, we are using pcRef like a global variable
        // from this point on, pc will not be addressed directly, but rather through pcRef.current, because it doesn't exist outside of this useEffect block
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
                <Button variant="contained" color="primary" onClick={createOffer} sx={{margin: 1, width: "max-content"}}>
                    Create Offer
                </Button>
                <Button variant="contained" color="primary" onClick={createAnswer} sx={{margin: 1, width: "max-content"}}>
                    Create Answer
                </Button>
                <div className="bounding-box">
                    <TextField
                        inputRef={textRef}
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{ margin: 1}}
                    />
                    <Button variant="contained" color="primary" onClick={createAndSetRemoteDesc} sx={{margin: 1, width: "max-content"}}>
                        Set Remote Description
                    </Button>
                    <Button variant="contained" color="primary" onClick={addICECandidate} sx={{margin: 1, width: "max-content"}}>
                        Add ICE Candidates
                    </Button>
                </div>
            </div>
        </div>
    );
}

    export default App;
