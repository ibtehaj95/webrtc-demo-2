import React, { useEffect, useState, useRef } from "react";
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import "./App.scss";

function App (){
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [callInputVal, setCallInputVal] = useState("");

    const handleStartWebcam = () => {
        // TODO: Implement start webcam logic
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
                <Button variant="contained" color="primary" onClick={handleStartWebcam} sx={{margin: 1, width: "min-content"}}>
                    Start Webcam
                </Button>
                <Button variant="contained" color="primary" onClick={handleCallRemote} sx={{margin: 1, width: "min-content"}}>
                    Call Remote
                </Button>
                <div>
                    <TextField label="Call Input" variant="outlined" value={callInputVal} onChange={(event) => {setCallInputVal(event.target.value)}} sx={{margin: 1}}/>
                    <Button variant="contained" color="primary" onClick={handleAcceptCall} sx={{margin: 1, width: "min-content"}}>
                        Accept Call
                    </Button>
                </div>
                <Button variant="contained" color="primary" onClick={handleHangUp} sx={{margin: 1, width: "min-content"}}>
                    Hang Up
                </Button>
            </div>
        </div>
    );
}

    export default App;
