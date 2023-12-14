import React, { useEffect, useState, useRef } from "react";
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import "./App.scss";

function App (){

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [startCameraDisabled, setStartCameraDisabled] = useState(false);

    const handleStartWebcam = () => {

        getUserMedia(); // get the user's webcam/microphone stream
    };

    const createOffer = () => {
        // TODO: Create offer logic
    };

    const createAnswer = () => {
        // TODO: Create answer logic
    };

    const createRemoteDesc = () => {
        // TODO: Create remote description logic
    };

    const createICECands = () => {
        // TODO: Create ICE candidates logic
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
                // remoteVideoRef.current.srcObject = stream; // only for testing
                setStartCameraDisabled(true); // disable the start camera button
            })
            .catch(error => {
                console.error("Error accessing media devices.", error);
            });
    };

    useEffect(() => {
        handleStartWebcam();    // get the user's webcam/microphone stream on component mount
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
                <Button variant="contained" color="primary" disabled={startCameraDisabled} onClick={handleStartWebcam} sx={{margin: 1, width: "max-content"}}>
                    Start Webcam
                </Button>
                <Button variant="contained" color="primary" onClick={createOffer} sx={{margin: 1, width: "max-content"}}>
                    Create Offer
                </Button>
                <Button variant="contained" color="primary" onClick={createAnswer} sx={{margin: 1, width: "max-content"}}>
                    Create Answer
                </Button>
                <Button variant="contained" color="primary" onClick={createRemoteDesc} sx={{margin: 1, width: "max-content"}}>
                    Create Remote Description
                </Button>
                <Button variant="contained" color="primary" onClick={createICECands} sx={{margin: 1, width: "max-content"}}>
                    Create ICE Candidates
                </Button>
            </div>
        </div>
    );
}

    export default App;
