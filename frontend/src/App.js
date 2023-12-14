import React, { useEffect, useState, useRef } from "react";
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import "./App.scss";

function App (){
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [callInputVal, setCallInputVal] = useState("");

    const handleStartWebcam = () => {

        getUserMedia(); // get the user's webcam/microphone stream
    };

    const handleCallRemote = () => {
        // TODO: Implement call remote logic
    };

    const handleAcceptCall = () => {
        // TODO: Implement accept call logic
    };

    const handleHangUp = () => {
        // TODO: Implement hang up logic
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
            })
            .catch(error => {
                console.error("Error accessing media devices.", error);
            });
    };

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
                    />
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        muted
                        className="remote-video"
                    />
                </div>
            </div>
            <div className="inputs-container">
                <Button variant="contained" color="primary" onClick={userAllMediaDevices} sx={{margin: 1, width: "max-content"}}>
                    Show All Media Devices
                </Button>
                <Button variant="contained" color="primary" onClick={handleStartWebcam} sx={{margin: 1, width: "max-content"}}>
                    Start Webcam
                </Button>
                <Button variant="contained" color="primary" onClick={handleCallRemote} sx={{margin: 1, width: "max-content"}}>
                    Call Remote
                </Button>
                <div>
                    <TextField label="Call Input" variant="outlined" size="small" value={callInputVal} onChange={(event) => {setCallInputVal(event.target.value)}} sx={{margin: 1}}/>
                    <Button variant="contained" color="primary" onClick={handleAcceptCall} sx={{margin: 1, width: "max-content"}}>
                        Accept Call
                    </Button>
                </div>
                <Button variant="contained" color="primary" onClick={handleHangUp} sx={{margin: 1, width: "max-content"}}>
                    Hang Up
                </Button>
            </div>
        </div>
    );
}

    export default App;
